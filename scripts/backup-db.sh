#!/bin/bash

# Solvik SaaS Database Backup Script
# Run this script to create a backup of the PostgreSQL database

set -e

# Configuration
BACKUP_DIR="/app/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="solvik_backup_${TIMESTAMP}.sql"
CONTAINER_NAME="solvik_postgres"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
echo "Creating database backup..."
docker exec $CONTAINER_NAME pg_dump -U solvik_user -d solvik_saas > "$BACKUP_DIR/$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_DIR/$BACKUP_FILE"

echo "Backup created: $BACKUP_DIR/${BACKUP_FILE}.gz"

# Keep only last 7 backups
find $BACKUP_DIR -name "solvik_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed successfully!"