#!/bin/bash
set -e

echo "==> Waiting for MySQL..."
until php -r "
    try { new PDO('mysql:host=mysql;port=3306', 'root', 'secret'); echo 'connected'; exit(0); }
    catch (PDOException \$e) { echo 'waiting'; exit(1); }
" 2>/dev/null; do
    sleep 2
done
echo "==> MySQL is ready."

echo "==> Waiting for Redis..."
until redis-cli -h redis ping 2>/dev/null | grep -q PONG; do
    sleep 2
done
echo "==> Redis is ready."

if [ ! -f vendor/autoload.php ]; then
    echo "==> Installing Composer dependencies..."
    composer install --no-dev --prefer-dist
fi

if [ -z "$APP_KEY" ]; then
    echo "==> Generating application key..."
    php artisan key:generate --force
fi

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Seeding database..."
php artisan db:seed --force 2>/dev/null || true

echo "==> Clearing caches..."
php artisan config:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true

echo "==> Starting Laravel development server..."
exec php artisan serve --host=0.0.0.0 --port=8000
