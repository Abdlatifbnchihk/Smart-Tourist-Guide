#!/bin/bash
set -e

echo "==> [Queue] Waiting for MySQL..."
until php -r "
    try { new PDO('mysql:host=mysql;port=3306', 'root', 'secret'); echo 'connected'; exit(0); }
    catch (PDOException \$e) { echo 'waiting'; exit(1); }
" 2>/dev/null; do
    sleep 2
done
echo "==> [Queue] MySQL is ready."

echo "==> [Queue] Waiting for Redis..."
until redis-cli -h redis ping 2>/dev/null | grep -q PONG; do
    sleep 2
done
echo "==> [Queue] Redis is ready."

if [ ! -f vendor/autoload.php ]; then
    echo "==> [Queue] Installing Composer dependencies..."
    composer install --no-dev --prefer-dist
fi

echo "==> [Queue] Starting queue worker..."
exec php artisan queue:work --verbose --tries=3 --timeout=90
