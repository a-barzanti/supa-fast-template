#!/usr/bin/env bash

temp_file=$(mktemp)
supabase start | tee "$temp_file"

SUPABASE_URL=$(grep "API URL:" "$temp_file" | awk '{print $3}')
SUPABASE_KEY=$(grep "service_role key:" "$temp_file" | awk '{print $3}')
POSTGRES_PORT=$(grep "DB URL:" "$temp_file" | sed 's/.*:54\([0-9]*\).*/\1/g')

sed -i.bak \
    -e "s#SUPABASE_URL=.*#SUPABASE_URL=$SUPABASE_URL#" \
    -e "s#SUPABASE_KEY=.*#SUPABASE_KEY=$SUPABASE_KEY#" \
    -e "s#POSTGRES_PORT=.*#POSTGRES_PORT=54$POSTGRES_PORT#" \
    .env

rm "$temp_file"
rm -f .env.bak

echo "done"
