package com.lankacart.userservice.service;

import com.lankacart.userservice.dto.AuthRequest;
import com.lankacart.userservice.dto.AuthResponse;
import com.lankacart.userservice.dto.RegisterRequest;
import com.lankacart.userservice.entity.User;
import com.lankacart.userservice.repository.UserRepository;
import com.lankacart.userservice.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void loginReturnsTokenForValidCredentials() {
        AuthRequest request = new AuthRequest();
        request.setUsername("john");
        request.setPassword("secret123");

        User user = new User();
        user.setId(1L);
        user.setUsername("john");
        user.setPassword("encoded-password");
        user.setRole("CUSTOMER");
        user.setEmail("john@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret123", "encoded-password")).thenReturn(true);
        when(jwtUtil.generateToken("john", "CUSTOMER")).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertEquals("jwt-token", response.getToken());
        assertEquals(1L, response.getId());
        assertEquals("john", response.getUsername());
        verify(userRepository).findByUsername("john");
    }

    @Test
    void loginThrowsUnauthorizedWhenPasswordIsWrong() {
        AuthRequest request = new AuthRequest();
        request.setUsername("john");
        request.setPassword("wrong-password");

        User user = new User();
        user.setUsername("john");
        user.setPassword("encoded-password");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", "encoded-password")).thenReturn(false);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> authService.login(request));
        assertEquals(HttpStatus.UNAUTHORIZED.value(), ex.getStatusCode().value());
    }

    @Test
    void registerThrowsBadRequestWhenUsernameAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("john");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(new User()));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> authService.register(request));
        assertEquals(HttpStatus.BAD_REQUEST.value(), ex.getStatusCode().value());
    }

    @Test
    void registerEncodesPasswordAndReturnsToken() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("john");
        request.setEmail("john@example.com");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPassword("secret123");
        request.setPhoneNumber("+94770000000");

        when(userRepository.findByUsername("john")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("secret123")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(10L);
            return user;
        });
        when(jwtUtil.generateToken("john", "CUSTOMER")).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        ArgumentCaptor<User> savedUserCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(savedUserCaptor.capture());

        User savedUser = savedUserCaptor.getValue();
        assertEquals("encoded-password", savedUser.getPassword());
        assertEquals("CUSTOMER", savedUser.getRole());
        assertEquals("jwt-token", response.getToken());
        assertEquals(10L, response.getId());
    }
}
