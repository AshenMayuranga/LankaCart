package com.lankacart.inventoryservice.controller;

import com.lankacart.inventoryservice.entity.Inventory;
import com.lankacart.inventoryservice.repository.InventoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InventoryControllerTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @InjectMocks
    private InventoryController inventoryController;

    @Test
    void decrementStockReturnsBadRequestWhenInsufficient() {
        Inventory inventory = inventory(1L, 2);
        when(inventoryRepository.findByProductId(1L)).thenReturn(Optional.of(inventory));

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> inventoryController.decrementStock(1L, 5)
        );

        assertEquals(HttpStatus.BAD_REQUEST.value(), ex.getStatusCode().value());
        verify(inventoryRepository, never()).save(any(Inventory.class));
    }

    @Test
    void decrementStockUpdatesQuantityWhenValid() {
        Inventory inventory = inventory(1L, 10);
        when(inventoryRepository.findByProductId(1L)).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<Inventory> response = inventoryController.decrementStock(1L, 3);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(7, response.getBody().getQuantity());
        assertNotNull(response.getBody().getLastUpdated());
        verify(inventoryRepository).save(inventory);
    }

    @Test
    void incrementStockReturnsBadRequestForInvalidQuantity() {
        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> inventoryController.incrementStock(1L, 0)
        );

        assertEquals(HttpStatus.BAD_REQUEST.value(), ex.getStatusCode().value());
        verifyNoInteractions(inventoryRepository);
    }

    @Test
    void updateInventoryReturnsNotFoundWhenIdMissing() {
        Inventory updateRequest = inventory(2L, 20);
        when(inventoryRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> inventoryController.updateInventory(99L, updateRequest)
        );

        assertEquals(HttpStatus.NOT_FOUND.value(), ex.getStatusCode().value());
    }

    private Inventory inventory(Long productId, int quantity) {
        Inventory inventory = new Inventory();
        inventory.setProductId(productId);
        inventory.setQuantity(quantity);
        inventory.setLocation("Warehouse A");
        inventory.setStatus("IN_STOCK");
        inventory.setSupplier("Supplier");
        inventory.setWarehouseCode("WH-1");
        inventory.setLastUpdated(LocalDateTime.now());
        return inventory;
    }
}
