package com.stationery.inventory.dto;

import java.time.LocalDateTime;

public class AuditLogResponse {
    private Long id;
    private String action;
    private Long itemId;
    private String itemName;
    private String changedBy;
    private String details;
    private LocalDateTime createdAt;

    public AuditLogResponse(Long id, String action, Long itemId, String itemName, String changedBy, String details, LocalDateTime createdAt) {
        this.id = id;
        this.action = action;
        this.itemId = itemId;
        this.itemName = itemName;
        this.changedBy = changedBy;
        this.details = details;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getAction() { return action; }
    public Long getItemId() { return itemId; }
    public String getItemName() { return itemName; }
    public String getChangedBy() { return changedBy; }
    public String getDetails() { return details; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
