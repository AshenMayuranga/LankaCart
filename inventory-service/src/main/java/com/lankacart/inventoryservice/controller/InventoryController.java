package com.lankacart.inventoryservice.controller;

import com.lankacart.inventoryservice.entity.Inventory;
import com.lankacart.inventoryservice.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    @GetMapping
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getInventoryById(@PathVariable Long id) {
        return inventoryRepository.findById(id)
                .map(inventory -> ResponseEntity.ok().body(inventory))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Inventory createInventory(@RequestBody Inventory inventory) {
        inventory.setLastUpdated(LocalDateTime.now());
        return inventoryRepository.save(inventory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateInventory(@PathVariable Long id, @RequestBody Inventory inventoryDetails) {
        return inventoryRepository.findById(id)
                .map(inventory -> {
                    inventory.setProductId(inventoryDetails.getProductId());
                    inventory.setQuantity(inventoryDetails.getQuantity());
                    inventory.setLocation(inventoryDetails.getLocation());
                    inventory.setStatus(inventoryDetails.getStatus());
                    inventory.setLastUpdated(LocalDateTime.now());
                    inventory.setSupplier(inventoryDetails.getSupplier());
                    inventory.setWarehouseCode(inventoryDetails.getWarehouseCode());
                    Inventory updatedInventory = inventoryRepository.save(inventory);
                    return ResponseEntity.ok().body(updatedInventory);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInventory(@PathVariable Long id) {
        return inventoryRepository.findById(id)
                .map(inventory -> {
                    inventoryRepository.delete(inventory);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
