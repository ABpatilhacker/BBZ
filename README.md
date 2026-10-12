# BULK BY ZONE — storefront and PHP/MySQL backend

This package contains the MGS public website, separate Microsoft Licenses and Storage catalogue pages, customer account pages, a PHP/MySQL API, and an administrator interface.

## Preview
1. Extract the ZIP and open the `MGS` directory in VS Code.
2. Live Server can preview the static frontend from `index.html`, but it does **not** execute PHP or connect to MySQL.
3. Backend testing requires PHP 8.1+ with PDO MySQL and a MySQL/MariaDB database.

## Backend setup
1. Create a production database and dedicated database user with access only to that database.
2. Import `private/schema.sql`.
3. Copy `private/config.example.php` to `private/config.php` and enter the real DB credentials. Do not publish `private/config.php`; keep secrets outside the document root when supported.
4. Upload the `MGS` directory to an HTTPS-enabled PHP host.
5. Run `php private/seed-products.php` from the site root.
6. Create an administrator from CLI: `php private/create-admin.php admin@example.com "MGS Administrator"`. Use a strong 12+ character password; do not run this utility through the browser.
7. Test sign-up/login, role restrictions, product editing, settings, and order enquiries on staging before launch.

## Admin
After signing in with an administrator account, open `admin.html`. Each product card opens `admin-product.html`, where product text, category, image path, visibility, and EUR/INR prices can be edited. Site settings and enquiry statuses are stored server-side when the database is configured.

## Payments — not connected
The current checkout stores an order enquiry and does not charge customers. No payment-provider account or merchant credentials were included in the supplied ZIP, so a live gateway cannot be activated or verified here. Before taking money, select a provider appropriate to the registered business and supported currencies, implement server-created hosted checkout sessions and signed webhook verification, and test success, cancellation, failure, refunds and duplicate notifications. Never collect or store raw card details in this site, and never trust a browser redirect as proof of payment.

## Product images
All 22 catalogue SKUs now point to bundled local image files; product and section photos do not depend on external image hosts. Generated images and capacity variants are representative mockups; they do not certify the delivered manufacturer, model, package contents, licence or capacity. Replace representative assets with company-owned product photos before taking paid orders.

## Launch checklist
- [ ] Production HTTPS, secure session settings, secret configuration, least-privilege DB user and backups
- [ ] Database configured and end-to-end server tests passed
- [ ] Admin credentials provisioned securely; unauthorised admin requests rejected
- [ ] Payment provider and signed webhooks integrated and verified (not active in this build)
- [ ] Prices, exact SKUs, availability and software licence rights approved by MGS
- [ ] Exact product images owned/licensed and checked
- [ ] Privacy, terms, refunds/cancellations, tax and delivery policies reviewed
- [ ] Email verification/password reset, transactional email, monitoring, rate limiting and security review completed

## Main files
- `css/storefront.css`: shared responsive styling
- `js/storefront.js`: catalogue, basket, account and admin UI/API logic
- `js/catalog.js`: local preview catalogue
- `api/index.php`: PHP API and server-side access checks
- `private/schema.sql`: database schema
- `private/config.example.php`: configuration template
- `private/create-admin.php`: CLI-only administrator provisioning
- `private/seed-products.php`: catalogue seeding utility

**Status:** backend-enabled deployment candidate; not a certified live production store. Configure and test the database, product images, and payment processing in the target hosting environment before accepting live orders or money.


## Latest product images and e-commerce behaviour
- Bundled generated images under `assets/images/` and `assets/images/products/` include MGS M.2 SSD, generic 2.5-inch SATA SSD, Office Professional Plus 2021/2024, Office Home & Business 2024, Windows 11 Pro DVD/USB, server-room, trade-port, paper and school-shoe visuals.
- The supplied Windows 11 Pro image and MGS package assets are included. All 22 catalogue products now point to bundled local images, so product rendering does not depend on third-party image hosts.
- Catalogue lists sort software versions by year ascending and storage capacities by product family ascending. Product detail pages display four related items below the full detail section.
- `private/catalog-seed.json` and `js/catalog.js` should be kept in sync. For an existing configured deployment, run `php private/seed-products.php` from the project root to update product catalogue images and text while preserving approved prices.
- The backend code passes PHP syntax checks, but a live database could not be tested in this environment: the ZIP has only `private/config.example.php`, no configured `private/config.php`, and this runtime lacks the PDO MySQL driver. A real database connection and payment gateway still require hosting credentials and end-to-end staging tests.


## Responsive and security updates
- The shared header uses a compact mobile layout with Basket and Sign in visible and the navigation behind the hamburger menu on tablet/mobile sizes.
- Product cards, product detail pages, related products, forms, account screens and admin panels have responsive grid overrides.
- Added a root `.htaccess` baseline with directory listing disabled and security headers; verify that the hosting server supports these directives and test CSP in staging.
- PHP API sessions enable strict mode and cookie-only sessions; HTTPS requests receive HSTS. Product/hero/logo image settings are restricted to existing local files under `assets/images/`.
- See `DEPLOYMENT_CHECKLIST.md` for exact database, administrator, staging, security and payment-gateway steps.

Shop hero image: replace `assets/images/shop-hero.jpg` with the final landscape image (recommended 1600 × 900 px or similar) using the exact same filename. The page and styles already point to this local file.

### Replace the DriveDiggers image

When you have the official DriveDiggers homepage image, overwrite `assets/images/drivediggers-home.jpg` with your chosen local image and keep that exact filename. The Home and Services pages reference this local path; no HTML or CSS edits are needed.


## Final correction note (image still to replace)

The DriveDiggers service currently uses the existing local image at `assets/images/drivediggers-home.jpg`. The official DriveDiggers homepage image was identified at `https://drivediggers.com/images/production/lab-ssd.webp`, but this environment could not download it to the ZIP due to unavailable outbound DNS/network access. Replace the local file with that official asset before director sign-off. See `assets/images/IMAGE_SOURCES.md`.
