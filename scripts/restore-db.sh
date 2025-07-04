#!/bin/bash

# Solvik SaaS Database Restore Script
# Usage: ./restore-db.sh backup_file.sql.gz

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup_file.sql.gz>"
    echo "Available backups:"
    ls -la /app/backups/solvik_backup_*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE=$1
CONTAINER_NAME="solvik_postgres"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file $BACKUP_FILE not found"
    exit 1
fi

echo "Restoring database from $BACKUP_FILE..."

# Decompress and restore
gunzip -c "$BACKUP_FILE" | docker exec -i $CONTAINER_NAME psql -U solvik_user -d solvik_saas

echo "Database restored successfully!"