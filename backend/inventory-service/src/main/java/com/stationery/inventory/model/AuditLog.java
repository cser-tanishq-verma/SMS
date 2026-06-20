package com.stationery.inventory.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action;

    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "item_name")
    private String itemName;

    @Column(name = "changed_by")
    private String changedBy;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public AuditLog() {}

    public AuditLog(String action, Long itemId, String itemName, String changedBy, String details) {
        this.action = action;
        this.itemId = itemId;
        this.itemName = itemName;
        this.changedBy = changedBy;
        this.details = details;
    }

    public Long getId() { return id; }
    public String getAction() { return action; }
    public Long getItemId() { return itemId; }
    public String getItemName() { return itemName; }
    public String getChangedBy() { return changedBy; }
    public String getDetails() { return details; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
