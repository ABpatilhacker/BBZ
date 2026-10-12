# Product image notes

All catalogue product image paths are now local files under `assets/images/products/`; section imagery is local under `assets/images/`. Product images do not require third-party image hosting.

- `mgs-m2-studio.jpg` — MGS-branded M.2 SSD studio reference; representative artwork, not a verified photograph of every production unit.
- `sata-ssd-studio.jpg` — generic 2.5-inch SATA SSD reference.
- `office-professional-plus-2021.jpg` and `office-professional-plus-2024.jpg` — representative Office package artwork.
- `office-home-business-2024.jpg` — representative Office Home & Business package artwork.
- `windows-11-pro-dvd-kit.jpg` and `windows-11-pro-usb-kit.jpg` — representative Windows 11 Pro media presentation.
- `windows-11-pro-box-user.jpg` — local copy of the supplied Windows 11 Pro image.
- The remaining SKU-specific files are locally generated representative variants mapped to each catalogue item. They are not a guarantee of the exact model, manufacturer, capacity, software edition, contents or licence supplied.

Before accepting paid orders, replace representative variants with company-owned product photographs where available and verify each image matches the physical SKU and the licence rights actually offered.

- MGS M.2 image assets were replaced with a correctly oriented crop of the user-supplied product photograph. The serial/barcode label is blurred for privacy. All listed NVMe capacities use the generic MGS product reference image until SKU-specific approved photos are supplied.
- `assets/images/drivediggers-home.jpg` is a locally hosted, unbranded data-centre visual used as a recovery-related image. The live DriveDiggers homepage image could not be downloaded directly from this runtime, so this is not represented as an exact copy of that image.
- `assets/images/mgs-portfolio-mix.jpg` is a locally generated collage of the six MGS business categories.


## Updated software catalogue artwork (2026-10-12)

The following Office listing visuals are original local SVG catalogue illustrations created for MGS. They are intentionally generic and are not Microsoft logos, licensed product boxes, or claims about the exact physical package or application bundle. Product titles and delivery-format labels reflect the MGS catalogue names only; edition, entitlement and activation details must be confirmed with the item supplied.

- `office-2024-pro-artwork.svg` — original abstract desktop software listing visual.
- `office-2024-pro-box-artwork.svg` — original boxed-listing visual.
- `office-2024-home-online-artwork.svg` — original online-delivery listing visual.
- `office-2024-home-bind-artwork.svg` — original account-binding listing visual.
- `office-2024-hb-bind-email-artwork.svg` — original email-delivery listing visual.
- `office-2024-hb-bind-box-artwork.svg` — original boxed-listing visual.
- `office-2026-enquiry-artwork.svg` — original enquiry-first listing visual; exact product edition and availability remain unconfirmed.

- `software-listing-fallback.svg` — neutral generic local fallback artwork for software listings if an individual image cannot load; not manufacturer packaging.

## Office packshot presentation refresh (2026-10-12)

The following Office catalogue cards now use the corresponding locally bundled JPEG product artwork already included in this project, instead of the simplified SVG category illustrations. Two source files had mirrored lettering and were corrected by horizontal reversal without changing the printed words:

- `office-professional-plus-2024.jpg` — Office Professional Plus 2024 representative box artwork for Office 2024 Pro.
- `office-2024-pro-box-product.jpg` — corrected-orientation derivative of the existing `office-2024-pro-box.jpg` source artwork.
- `office-2024-home-online-product.jpg` — corrected-orientation derivative of the existing `office-24-home-online.jpg` source artwork.
- `office-24-home-bind.jpg` — existing Home & Business 2024 representative box artwork.
- `o-24hb-bind-email.jpg` and `o-24hb-bind-box-cd.jpg` — existing Home & Business 2024 representative box artwork for the email and boxed catalogue variants.
- `office-2021-pro.jpg` and `office-2021-pro-box.jpg` — existing Office Professional Plus 2021 representative box artwork.
- Office 2026 remains on the neutral enquiry-first SVG because the exact edition and availability have not been verified; the existing `office-2026.jpg` asset is labelled 2024 and was not reused.

These are catalogue-identification visuals already supplied within the source ZIP, not proof of Microsoft authorization, entitlement, physical package contents, or the exact licence delivered. The JS catalogue and `private/catalog-seed.json` image paths are kept in sync; after deployment to a configured database, run `php private/seed-products.php` to update existing product records' image paths.
