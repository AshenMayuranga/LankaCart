package com.lankacart.productservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lankacart.productservice.domain.Product;
import com.lankacart.productservice.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Optional;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductRepository productRepository;

    @Test
    void createProductReturnsCreatedAndLocation() throws Exception {
        Product saved = new Product(1L, "Tea", new BigDecimal("100.00"), "Ceylon Tea");
        when(productRepository.save(any(Product.class))).thenReturn(saved);

        Product request = new Product(999L, "Tea", new BigDecimal("100.00"), "Ceylon Tea");

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", containsString("/products/1")));

        ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(captor.capture());
        assertNull(captor.getValue().getId());
    }

    @Test
    void createProductWithInvalidBodyReturnsBadRequest() throws Exception {
        Product request = new Product(null, "", new BigDecimal("-1.00"), "Invalid");

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateReturnsNotFoundWhenProductDoesNotExist() throws Exception {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        Product request = new Product(null, "Tea", new BigDecimal("120.00"), "Updated");

        mockMvc.perform(put("/products/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteReturnsNoContentWhenProductExists() throws Exception {
        when(productRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/products/1"))
                .andExpect(status().isNoContent());

        verify(productRepository).deleteById(1L);
    }
}
