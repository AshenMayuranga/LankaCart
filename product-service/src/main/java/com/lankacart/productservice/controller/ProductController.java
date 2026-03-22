package com.lankacart.productservice.controller;

import com.lankacart.productservice.domain.Product;
import com.lankacart.productservice.repository.ProductRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * Mapped at the servlet root so that the API Gateway can strip the {@code /products} prefix from
 * incoming requests (see {@code Path=/products/**} + {@code StripPrefix=1}). Clients still call
 * {@code /products/...} on the gateway (or {@code /products/...} on this service directly).
 */
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "Products")
public class ProductController {

    private final ProductRepository productRepository;

    @GetMapping
    @Operation(summary = "List all products")
    public List<Product> list() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by id")
    public ResponseEntity<Product> get(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create product")
    public ResponseEntity<Product> create(@Valid @RequestBody Product body) {
        body.setId(null);
        Product saved = productRepository.save(body);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getId())
                .toUri();
        return ResponseEntity.created(location).body(saved);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update product")
    public ResponseEntity<Product> update(@PathVariable Long id, @Valid @RequestBody Product body) {
        return productRepository.findById(id)
                .map(existing -> {
                    existing.setName(body.getName());
                    existing.setPrice(body.getPrice());
                    existing.setDescription(body.getDescription());
                    return ResponseEntity.ok(productRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
