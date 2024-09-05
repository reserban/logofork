import { NextRequest, NextResponse } from "next/server";
import AdmZip from "adm-zip";
import sharp from "sharp";
import sharpIco from "sharp-ico";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    // Parse form data
    const formData = await req.formData();
    const files = ["vertical", "horizontal", "logomark", "wordmark"].map(
      (key) => formData.get(key) as File | null
    );
    const packageName = formData.get("packageName") as string;
    const selectedExtensions = (formData.get("extensions") as string).split(
      ","
    );
    const backgroundColor = formData.get("backgroundColor") as string;

    // Filter valid files and folders
    const validFiles = files.filter((file) => file !== null);
    const validFolders = [
      "Vertical",
      "Horizontal",
      "Logomark",
      "Wordmark",
    ].filter((_, index) => files[index] !== null);

    if (validFiles.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const zip = new AdmZip();
    const allFolders = {
      Raster: ["PNG", "WEBP", "TIFF", "JPG", "Favicon"],
      Vector: ["Designer", "Illustrator", "SVG", "EPS", "PDF"],
    };

    // Combine SVGs into a master SVG
    const combinedSvg = await combineSvgs(validFiles, packageName);
    const masterFolderName = "Master";
    const combinedSvgFileName = `${packageName}-master`;

    // Add master SVG to zip based on selected extensions
    if (selectedExtensions.includes("afdesign")) {
      zip.addFile(
        `${masterFolderName}/Designer/${combinedSvgFileName}.afdesign`,
        Buffer.from(combinedSvg)
      );
    }
    if (selectedExtensions.includes("ai")) {
      zip.addFile(
        `${masterFolderName}/Illustrator/${combinedSvgFileName}.ai`,
        Buffer.from(combinedSvg)
      );
    }
    if (selectedExtensions.includes("svg")) {
      zip.addFile(
        `${masterFolderName}/SVG/${combinedSvgFileName}.svg`,
        Buffer.from(combinedSvg)
      );
    }

    // Process each valid file
    for (let index = 0; index < validFiles.length; index++) {
      const file = validFiles[index];
      if (file) {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const rootFolderName = getFolderName(validFolders, validFolders[index]);
        const logoType = validFolders[index].toLowerCase();

        const sharpInstance = sharp(fileBuffer);
        const { width, height } = await sharpInstance.metadata();
        const aspectRatio = width! / height!;

        const folders = { ...allFolders };
        const safeFilename = packageName.replace(/[^a-zA-Z0-9.-]/g, "_");

        // Process each mode (Color, Black, White)
        await Promise.all(
          ["Color", "Black", "White"].map(async (mode) => {
            const isBlack = mode === "Black";
            const isWhite = mode === "White";
            const modeFolderName = mode;
            const modeFilename = mode.toLowerCase();

            // Modify SVG content based on mode
            let svgContent = fileBuffer.toString();
            if (isBlack) {
              svgContent = replaceColorsWithBlack(svgContent);
            } else if (isWhite) {
              svgContent = replaceColorsWithWhite(svgContent);
            }

            const svgBuffer = Buffer.from(svgContent);
            const svgHtml = `<html><body>${svgContent}</body></html>`;
            const pdfBuffer = await generatePdfFromHtml(svgHtml);

            // Add vector files to zip
            if (selectedExtensions.includes("svg")) {
              addFileToZip(
                zip,
                rootFolderName,
                modeFolderName,
                folders,
                "Vector",
                "SVG",
                `${safeFilename}-${logoType}-${modeFilename}`,
                svgBuffer,
                "svg"
              );
            }
            if (selectedExtensions.includes("ai")) {
              addFileToZip(
                zip,
                rootFolderName,
                modeFolderName,
                folders,
                "Vector",
                "Illustrator",
                `${safeFilename}-${logoType}-${modeFilename}`,
                svgBuffer,
                "ai"
              );
            }
            if (selectedExtensions.includes("eps")) {
              addFileToZip(
                zip,
                rootFolderName,
                modeFolderName,
                folders,
                "Vector",
                "EPS",
                `${safeFilename}-${logoType}-${modeFilename}`,
                svgBuffer,
                "eps"
              );
            }
            if (selectedExtensions.includes("afdesign")) {
              addFileToZip(
                zip,
                rootFolderName,
                modeFolderName,
                folders,
                "Vector",
                "Designer",
                `${safeFilename}-${logoType}-${modeFilename}`,
                svgBuffer,
                "afdesign"
              );
            }
            if (selectedExtensions.includes("pdf")) {
              addFileToZip(
                zip,
                rootFolderName,
                modeFolderName,
                folders,
                "Vector",
                "PDF",
                `${safeFilename}-${logoType}-${modeFilename}`,
                pdfBuffer,
                "pdf"
              );
            }

            // Process raster images
            const rasterSizes = [250, 500, 1000, 4000];
            for (const size of rasterSizes) {
              const dimension =
                aspectRatio > 1 ? { width: size } : { height: size };
              const padding = Math.round(size * 0.02);

              let sharpInstance = sharp(svgBuffer)
                .resize(dimension)
                .extend({
                  top: padding,
                  bottom: padding,
                  left: padding,
                  right: padding,
                  background: { r: 0, g: 0, b: 0, alpha: 0 },
                });

              const pngBuffer = await sharpInstance.png().toBuffer();
              if (selectedExtensions.includes("png")) {
                addFileToZip(
                  zip,
                  rootFolderName,
                  modeFolderName,
                  folders,
                  "Raster",
                  "PNG",
                  `${safeFilename}-${logoType}-${modeFilename}-${size}`,
                  pngBuffer,
                  "png"
                );
              }

              // Process JPG images
              if (selectedExtensions.includes("jpg")) {
                let jpgBackgroundColor;
                if (mode === "Color") {
                  jpgBackgroundColor = backgroundColor;
                } else if (mode === "White") {
                  jpgBackgroundColor = "#000000";
                } else if (mode === "Black") {
                  jpgBackgroundColor = "#FFFFFF";
                }

                if (logoType === "logomark") {
                  const squareSize = Math.max(size, size);
                  const logoPadding = Math.round(squareSize * 0.26);

                  const jpgBuffer = await sharp({
                    create: {
                      width: squareSize,
                      height: squareSize,
                      channels: 4,
                      background: { r: 0, g: 0, b: 0, alpha: 0 },
                    },
                  })
                    .composite([
                      {
                        input: await sharp(pngBuffer)
                          .resize(
                            squareSize - 2 * logoPadding,
                            squareSize - 2 * logoPadding,
                            {
                              fit: "contain",
                              background: { r: 0, g: 0, b: 0, alpha: 0 },
                            }
                          )
                          .toBuffer(),
                        gravity: "center",
                      },
                    ])
                    .flatten({ background: jpgBackgroundColor })
                    .jpeg({ quality: 100 })
                    .toBuffer();

                  addFileToZip(
                    zip,
                    rootFolderName,
                    modeFolderName,
                    folders,
                    "Raster",
                    "JPG",
                    `${safeFilename}-${logoType}-${modeFilename}-${squareSize}`,
                    jpgBuffer,
                    "jpg"
                  );
                } else {
                  const jpgBuffer = await sharp(pngBuffer)
                    .flatten({ background: jpgBackgroundColor })
                    .jpeg({ quality: 100 })
                    .toBuffer();

                  addFileToZip(
                    zip,
                    rootFolderName,
                    modeFolderName,
                    folders,
                    "Raster",
                    "JPG",
                    `${safeFilename}-${logoType}-${modeFilename}-${size}`,
                    jpgBuffer,
                    "jpg"
                  );
                }
              }

              // Process favicon images
              if (
                logoType === "logomark" &&
                selectedExtensions.includes("favicon")
              ) {
                const faviconSizes = [
                  { size: 192, name: "android-chrome-192x192" },
                  { size: 512, name: "android-chrome-512x512" },
                  { size: 180, name: "apple-touch-icon" },
                ];

                const coloredSvgBuffer = fileBuffer;
                for (const { size, name } of faviconSizes) {
                  const padding = Math.round(size * 0.26);
                  const logoSize = size - 2 * padding;

                  const pngBuffer = await sharp({
                    create: {
                      width: size,
                      height: size,
                      channels: 4,
                      background: { r: 0, g: 0, b: 0, alpha: 0 },
                    },
                  })
                    .composite([
                      {
                        input: await sharp(coloredSvgBuffer)
                          .resize(logoSize, logoSize, {
                            fit: "contain",
                            background: { r: 0, g: 0, b: 0, alpha: 0 },
                          })
                          .toBuffer(),
                        gravity: "center",
                      },
                    ])
                    .flatten({ background: backgroundColor })
                    .png()
                    .toBuffer();

                  addFileToZip(
                    zip,
                    rootFolderName,
                    "Color",
                    folders,
                    "Favicon",
                    "",
                    name,
                    pngBuffer,
                    "png"
                  );
                }

                const icoSizes = [16, 32, 48];
                const icoBuffers = await Promise.all(
                  icoSizes.map(async (size) => {
                    const padding = Math.round(size * 0.26);
                    const logoSize = size - 2 * padding;

                    return await sharp({
                      create: {
                        width: size,
                        height: size,
                        channels: 4,
                        background: { r: 0, g: 0, b: 0, alpha: 0 },
                      },
                    })
                      .composite([
                        {
                          input: await sharp(coloredSvgBuffer)
                            .resize(logoSize, logoSize, {
                              fit: "contain",
                              background: { r: 0, g: 0, b: 0, alpha: 0 },
                            })
                            .toBuffer(),
                          gravity: "center",
                        },
                      ])
                      .flatten({ background: backgroundColor })
                      .png()
                      .toBuffer();
                  })
                );

                const icoBuffer = await sharpIco.encode(icoBuffers);

                addFileToZip(
                  zip,
                  rootFolderName,
                  "Color",
                  folders,
                  "Favicon",
                  "",
                  "favicon",
                  icoBuffer,
                  "ico"
                );

                const mstileSize = 150;
                const mstilePadding = Math.round(mstileSize * 0.26);
                const mstileLogoSize = mstileSize - 2 * mstilePadding;

                const mstileBuffer = await sharp({
                  create: {
                    width: mstileSize,
                    height: mstileSize,
                    channels: 4,
                    background: { r: 0, g: 0, b: 0, alpha: 0 },
                  },
                })
                  .composite([
                    {
                      input: await sharp(coloredSvgBuffer)
                        .resize(mstileLogoSize, mstileLogoSize, {
                          fit: "contain",
                          background: { r: 0, g: 0, b: 0, alpha: 0 },
                        })
                        .toBuffer(),
                      gravity: "center",
                    },
                  ])
                  .flatten({ background: backgroundColor })
                  .png()
                  .toBuffer();

                addFileToZip(
                  zip,
                  rootFolderName,
                  "Color",
                  folders,
                  "Favicon",
                  "",
                  "mstile-150x150",
                  mstileBuffer,
                  "png"
                );

                addFileToZip(
                  zip,
                  rootFolderName,
                  "Color",
                  folders,
                  "Favicon",
                  "",
                  "safari-pinned-tab",
                  coloredSvgBuffer,
                  "svg"
                );
              }

              // Process WEBP images
              if (selectedExtensions.includes("webp")) {
                const webpBuffer = await sharp(pngBuffer)
                  .webp({ quality: 80 })
                  .toBuffer();
                addFileToZip(
                  zip,
                  rootFolderName,
                  modeFolderName,
                  folders,
                  "Raster",
                  "WEBP",
                  `${safeFilename}-${logoType}-${modeFilename}-${size}`,
                  webpBuffer,
                  "webp"
                );
              }

              // Process TIFF images
              if (selectedExtensions.includes("tiff")) {
                const tiffBuffer = await sharp(pngBuffer)
                  .tiff({
                    compression: "lzw",
                    predictor: "horizontal",
                  })
                  .toBuffer();
                addFileToZip(
                  zip,
                  rootFolderName,
                  modeFolderName,
                  folders,
                  "Raster",
                  "TIFF",
                  `${safeFilename}-${logoType}-${modeFilename}-${size}`,
                  tiffBuffer,
                  "tiff"
                );
              }
            }
          })
        );
      }
    }

    // Generate the zip buffer and return the response
    const zipBuffer = zip.toBuffer();
    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${packageName}-logo-package.zip"`,
        "Content-Type": "application/zip",
      },
    });
  } catch (error) {
    console.error("Error generating logo package:", error);
    return NextResponse.json(
      { error: "Failed to generate logo package" },
      { status: 500 }
    );
  }
}

// Helper functions remain the same
function addFileToZip(
  zip: AdmZip,
  rootFolderName: string,
  modeFolderName: string,
  folders: { [key: string]: string[] },
  folderType: string,
  subfolderType: string,
  fileName: string,
  buffer: Buffer,
  extension: string
) {
  let path;
  if (folderType === "Favicon") {
    path = `${rootFolderName}/${modeFolderName}/Favicon/${fileName}.${extension}`;
  } else {
    path = `${rootFolderName}/${modeFolderName}/${getFolderName(
      folders,
      folderType
    )}/${getSubfolderName(
      folders,
      folderType,
      subfolderType
    )}/${fileName}.${extension}`;
  }
  zip.addFile(path, buffer);
}

const getFolderName = (
  folders: string[] | { [key: string]: string[] },
  folder: string
) => {
  return folder;
};

const getSubfolderName = (
  folders: { [key: string]: string[] },
  folder: string,
  subfolder: string
) => {
  return subfolder;
};

async function generatePdfFromHtml(htmlContent: string): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
  return Buffer.from(pdfBuffer);
}

function replaceColorsWithBlack(svgContent: string): string {
  return replaceColors(svgContent, "black");
}

function replaceColorsWithWhite(svgContent: string): string {
  return replaceColors(svgContent, "white");
}

function replaceColors(svgContent: string, color: string): string {
  const replacements = [
    { regex: /fill="[^"]*"/g, replacement: `fill="${color}"` },
    { regex: /fill:#[0-9A-Fa-f]{3,6}/g, replacement: `fill:${color}` },
    { regex: /fill:rgb\([^)]*\)/g, replacement: `fill:${color}` },
    { regex: /fill:rgba\([^)]*\)/g, replacement: `fill:${color}` },
    { regex: /stroke="[^"]*"/g, replacement: `stroke="${color}"` },
    { regex: /stroke:#[0-9A-Fa-f]{3,6}/g, replacement: `stroke:${color}` },
    { regex: /stroke:rgb\([^)]*\)/g, replacement: `stroke:${color}` },
    { regex: /stroke:rgba\([^)]*\)/g, replacement: `stroke:${color}` },
    { regex: /stop-color="[^"]*"/g, replacement: `stop-color="${color}"` },
    {
      regex: /stop-color:#[0-9A-Fa-f]{3,6}/g,
      replacement: `stop-color:${color}`,
    },
    { regex: /stop-color:rgb\([^)]*\)/g, replacement: `stop-color:${color}` },
    { regex: /stop-color:rgba\([^)]*\)/g, replacement: `stop-color:${color}` },
  ];

  let modifiedContent = svgContent;

  for (const { regex, replacement } of replacements) {
    modifiedContent = modifiedContent.replace(regex, replacement);
  }

  modifiedContent = modifiedContent.replace(
    /<linearGradient[^>]*>[\s\S]*?<\/linearGradient>/g,
    ""
  );
  modifiedContent = modifiedContent.replace(
    /<radialGradient[^>]*>[\s\S]*?<\/radialGradient>/g,
    ""
  );
  modifiedContent = modifiedContent.replace(/url\(#[^)]+\)/g, color);

  return modifiedContent;
}

async function combineSvgs(
  files: (File | null)[],
  packageName: string
): Promise<string> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let svgContent = "";
  const validFiles = files.filter((file) => file !== null);
  const padding = 20;
  const rectSize = 500;

  const versions = ["Color", "Black", "White"];
  const gridWidth = 2 * (rectSize + padding) - padding;
  const gridHeight = 2 * (rectSize + padding) - padding;
  const totalWidth = gridWidth;
  const totalHeight = versions.length * (gridHeight + padding) - padding;

  for (let versionIndex = 0; versionIndex < versions.length; versionIndex++) {
    const version = versions[versionIndex];

    for (
      let fileIndex = 0;
      fileIndex < Math.min(validFiles.length, 4);
      fileIndex++
    ) {
      const file = validFiles[fileIndex];
      if (file) {
        const svg = await file.text();

        let versionedSvg = svg;
        if (version === "Black") {
          versionedSvg = replaceColorsWithBlack(svg);
        } else if (version === "White") {
          versionedSvg = replaceColorsWithWhite(svg);
        }

        const row = Math.floor(fileIndex / 2);
        const col = fileIndex % 2;
        const xPosition = col * (rectSize + padding);
        const yPosition =
          versionIndex * (gridHeight + padding) + row * (rectSize + padding);

        svgContent += `
          <g transform="translate(${xPosition}, ${yPosition})">
            <rect width="${rectSize}" height="${rectSize}" fill="transparent" stroke="rgba(0,0,0,0.1)" stroke-width="1" />
            <g id="logo-${versionIndex}-${fileIndex}">
              ${versionedSvg}
            </g>
          </g>
        `;
      }
    }
  }

  const combinedHtml = `
    <html>
      <body>
        <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}">
          ${svgContent}
        </svg>
      </body>
    </html>
  `;

  await page.setContent(combinedHtml);

  const alignLogos = await page.evaluate(() => {
    const logos = document.querySelectorAll('[id^="logo-"]');
    logos.forEach((logo) => {
      const svgElement = logo.querySelector("svg");
      if (svgElement) {
        const bbox = svgElement.getBBox();
        const scale = Math.min(500 / bbox.width, 500 / bbox.height) * 0.8;
        const translateX = (500 - bbox.width * scale) / 2 - bbox.x * scale;
        const translateY = (500 - bbox.height * scale) / 2 - bbox.y * scale;
        svgElement.setAttribute(
          "transform",
          `translate(${translateX}, ${translateY}) scale(${scale})`
        );
      }
    });
    return document.querySelector("svg")!.outerHTML;
  });

  await browser.close();
  return alignLogos;
}
