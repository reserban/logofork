import { NextRequest, NextResponse } from "next/server";
import AdmZip from "adm-zip";
import sharp from "sharp";
import sharpIco from "sharp-ico";
import fs from "fs";
import path from "path";
import { optimize } from "svgo";

// Standardize SVG content
function standardizeSVG(svgContent: string): string {
  const result = optimize(svgContent, {
    plugins: [
      "removeDoctype",
      "removeXMLProcInst",
      "removeComments",
      "removeMetadata",
      "removeTitle",
      "removeDesc",
      "removeUselessDefs",
      "removeEditorsNSData",
      "removeEmptyAttrs",
      "removeHiddenElems",
      "removeEmptyText",
      "removeEmptyContainers",
      "cleanupEnableBackground",
      "convertStyleToAttrs",
      "convertColors",
      "convertPathData",
      "convertTransform",
      "removeUnknownsAndDefaults",
      "removeNonInheritableGroupAttrs",
      "removeUselessStrokeAndFill",
      "removeUnusedNS",
      "cleanupIds",
      "cleanupNumericValues",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "collapseGroups",
      "removeRasterImages",
      "mergePaths",
      "convertShapeToPath",
      "sortAttrs",
      "removeDimensions",
    ],
  });

  return result.data;
}

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

    const selectedModes = ["Color", "Black", "White"].filter((mode) =>
      selectedExtensions.includes(mode.toLowerCase())
    );

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
      Motion: ["Opacity", "Bounce", "Pulse", "Swing"],
    };

    const gridSize = 2;
    const logoHeight = 300;
    const logoWidth = 500;
    const totalHeight =
      logoHeight *
      selectedModes.length *
      Math.ceil(validFiles.length / gridSize); // Adjust height based on selected modes
    const totalWidth = logoWidth * gridSize;

    // Calculate the translation to center the grid
    const translateX = (totalWidth - logoWidth * gridSize) / 2;
    const translateY =
      (totalHeight -
        logoHeight *
          selectedModes.length *
          Math.ceil(validFiles.length / gridSize)) /
      2;

    let masterSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">`;
    masterSvgContent += `<g transform="translate(${translateX}, ${translateY})">`; // Start group and apply translation

    // Process each valid file in parallel
    await Promise.all(
      validFiles.map(async (file, index) => {
        if (file) {
          const fileBuffer = Buffer.from(await file.arrayBuffer());
          const rootFolderName = getFolderName(
            validFolders,
            validFolders[index]
          );
          const logoType = validFolders[index]
            .replace(/^\d+\s/, "")
            .toLowerCase()
            .replace(/\s/g, ""); // Remove numbers and spaces

          const sharpInstance = sharp(fileBuffer);
          const { width, height } = await sharpInstance.metadata();
          const aspectRatio = width! / height!;

          const folders = { ...allFolders };
          const safeFilename = packageName.replace(/[^a-zA-Z0-9.-]/g, "_");

          // Optimize SVG content
          let svgContent = fileBuffer.toString();
          svgContent = standardizeSVG(svgContent); // Standardize SVG content

          // Process each selected mode in parallel
          await Promise.all(
            selectedModes.map(async (mode, colorIndex) => {
              const isBlack = mode === "Black";
              const isWhite = mode === "White";
              const modeFolderName = mode;
              const modeFilename = mode.toLowerCase();

              // Modify SVG content based on mode
              let modeSvgContent = svgContent;
              if (isBlack) {
                modeSvgContent = replaceColorsWithBlack(modeSvgContent);
              } else if (isWhite) {
                modeSvgContent = replaceColorsWithWhite(modeSvgContent);
              }

              const svgBuffer = Buffer.from(modeSvgContent);

              // Add vector files to zip
              if (selectedExtensions.includes("svg")) {
                addFileToZip(
                  zip,
                  `Individual/${validFolders[index]}`,
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
                  `Individual/${validFolders[index]}`,
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
                  `Individual/${validFolders[index]}`,
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
                  `Individual/${validFolders[index]}`,
                  modeFolderName,
                  folders,
                  "Vector",
                  "Designer",
                  `${safeFilename}-${logoType}-${modeFilename}`,
                  svgBuffer,
                  "afdesign"
                );
              }

              // Generate CSS animations for Motion folder
              if (selectedExtensions.includes("motion")) {
                const animatedSvgContentOpacity = generateAnimatedSvg(
                  modeSvgContent,
                  "loop"
                );
                const animatedSvgContentBounce = generateAnimatedSvg(
                  modeSvgContent,
                  "bounce"
                );
                const animatedSvgContentPulse = generateAnimatedSvg(
                  modeSvgContent,
                  "pulse"
                );
                const animatedSvgContentSwing = generateAnimatedSvg(
                  modeSvgContent,
                  "swing"
                );

                addFileToZip(
                  zip,
                  `Individual/${validFolders[index]}`,
                  modeFolderName,
                  folders,
                  "Motion",
                  "Opacity",
                  `${safeFilename}-${logoType}-${modeFilename}-loop`,
                  Buffer.from(animatedSvgContentOpacity),
                  "svg"
                );

                addFileToZip(
                  zip,
                  `Individual/${validFolders[index]}`,
                  modeFolderName,
                  folders,
                  "Motion",
                  "Bounce",
                  `${safeFilename}-${logoType}-${modeFilename}-bounce`,
                  Buffer.from(animatedSvgContentBounce),
                  "svg"
                );

                addFileToZip(
                  zip,
                  `Individual/${validFolders[index]}`,
                  modeFolderName,
                  folders,
                  "Motion",
                  "Pulse",
                  `${safeFilename}-${logoType}-${modeFilename}-pulse`,
                  Buffer.from(animatedSvgContentPulse),
                  "svg"
                );

                addFileToZip(
                  zip,
                  `Individual/${validFolders[index]}`,
                  modeFolderName,
                  folders,
                  "Motion",
                  "Swing",
                  `${safeFilename}-${logoType}-${modeFilename}-swing`,
                  Buffer.from(animatedSvgContentSwing),
                  "svg"
                );
              }

              // Remove XML and SVG tags from the individual SVG content
              const cleanedSvgContent = modeSvgContent
                .replace(/<\?xml.*?\?>/g, "") // Remove XML declaration
                .replace(/<!DOCTYPE.*?>/g, "") // Remove DOCTYPE declaration
                .replace(/<svg.*?>/g, "") // Remove opening SVG tag
                .replace(/<\/svg>/g, ""); // Remove closing SVG tag

              // Calculate position in the grid
              const row = Math.floor(index / gridSize);
              const col = index % gridSize;
              const x = col * logoWidth + (logoWidth - width!) / 2;
              const y =
                (row + colorIndex * Math.ceil(validFiles.length / gridSize)) *
                  logoHeight +
                (logoHeight - height!) / 2;

              // Add cleaned SVG content to master SVG content
              masterSvgContent += `<g transform="translate(${x}, ${y})">${cleanedSvgContent}</g>`;

              // Process raster images in parallel
              const rasterSizes = [250, 500, 1000, 4000];
              await Promise.all(
                rasterSizes.map(async (size) => {
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

                  const pngBuffer = await sharpInstance
                    .png({ quality: 80, compressionLevel: 9 })
                    .toBuffer(); // Adjusted quality and compression
                  if (selectedExtensions.includes("png")) {
                    addFileToZip(
                      zip,
                      `Individual/${validFolders[index]}`,
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
                        .jpeg({ quality: 85 }) // Adjusted quality
                        .toBuffer();

                      addFileToZip(
                        zip,
                        `Individual/${validFolders[index]}`,
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
                        .jpeg({ quality: 85 }) // Adjusted quality
                        .toBuffer();

                      addFileToZip(
                        zip,
                        `Individual/${validFolders[index]}`,
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
                    selectedExtensions.includes("favicons")
                  ) {
                    const faviconSizes = [
                      { size: 192, name: "android-chrome-192x192" },
                      { size: 512, name: "android-chrome-512x512" },
                      { size: 180, name: "apple-touch-icon" },
                    ];

                    const modes = ["Color", "Black", "White"];
                    await Promise.all(
                      modes.map(async (mode) => {
                        if (!selectedExtensions.includes(mode.toLowerCase()))
                          return; // Check if the mode is selected

                        let coloredSvgBuffer = fileBuffer;
                        let faviconBackgroundColor = backgroundColor;

                        if (mode === "Black") {
                          coloredSvgBuffer = Buffer.from(
                            replaceColorsWithBlack(fileBuffer.toString())
                          );
                          faviconBackgroundColor = "#FFFFFF"; // White background for black logo
                        } else if (mode === "White") {
                          coloredSvgBuffer = Buffer.from(
                            replaceColorsWithWhite(fileBuffer.toString())
                          );
                          faviconBackgroundColor = "#000000"; // Black background for white logo
                        }

                        await Promise.all(
                          faviconSizes.map(async ({ size, name }) => {
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
                                      background: {
                                        r: 0,
                                        g: 0,
                                        b: 0,
                                        alpha: 0,
                                      },
                                    })
                                    .toBuffer(),
                                  gravity: "center",
                                },
                              ])
                              .flatten({ background: faviconBackgroundColor })
                              .png()
                              .toBuffer();

                            addFileToZip(
                              zip,
                              `Individual/${validFolders[index]}`,
                              mode,
                              folders,
                              "Favicon",
                              "",
                              name,
                              pngBuffer,
                              "png"
                            );
                          })
                        );

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
                                      background: {
                                        r: 0,
                                        g: 0,
                                        b: 0,
                                        alpha: 0,
                                      },
                                    })
                                    .toBuffer(),
                                  gravity: "center",
                                },
                              ])
                              .flatten({ background: faviconBackgroundColor })
                              .png()
                              .toBuffer();
                          })
                        );
                        const icoBuffer = await sharpIco.encode(icoBuffers);

                        addFileToZip(
                          zip,
                          `Individual/${validFolders[index]}`,
                          mode,
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
                          .flatten({ background: faviconBackgroundColor })
                          .png()
                          .toBuffer();

                        addFileToZip(
                          zip,
                          `Individual/${validFolders[index]}`,
                          mode,
                          folders,
                          "Favicon",
                          "",
                          "mstile-150x150",
                          mstileBuffer,
                          "png"
                        );

                        addFileToZip(
                          zip,
                          `Individual/${validFolders[index]}`,
                          mode,
                          folders,
                          "Favicon",
                          "",
                          "safari-pinned-tab",
                          coloredSvgBuffer,
                          "svg"
                        );
                      })
                    );
                  }

                  // Process WEBP images
                  if (selectedExtensions.includes("webp")) {
                    const webpBuffer = await sharp(pngBuffer)
                      .webp({ quality: 75 }) // Adjusted quality
                      .toBuffer();
                    addFileToZip(
                      zip,
                      `Individual/${validFolders[index]}`,
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
                        quality: 80, // Adjusted quality
                      })
                      .toBuffer();
                    addFileToZip(
                      zip,
                      `Individual/${validFolders[index]}`,
                      modeFolderName,
                      folders,
                      "Raster",
                      "TIFF",
                      `${safeFilename}-${logoType}-${modeFilename}-${size}`,
                      tiffBuffer,
                      "tiff"
                    );
                  }
                })
              );
            })
          );
        }
      })
    );

    masterSvgContent += `</g></svg>`; // Close group and SVG
    const masterSvgBuffer = Buffer.from(masterSvgContent);

    if (selectedExtensions.includes("master")) {
      zip.addFile(
        `Master/SVG/${packageName.replace(/[^a-zA-Z0-9.-]/g, "_")}-master.svg`,
        masterSvgBuffer
      );

      // Convert master SVG to EPS, AFDesign, and AI formats
      if (selectedExtensions.includes("eps")) {
        zip.addFile(
          `Master/EPS/${packageName.replace(
            /[^a-zA-Z0-9.-]/g,
            "_"
          )}-master.eps`,
          masterSvgBuffer
        );
      }
      if (selectedExtensions.includes("afdesign")) {
        zip.addFile(
          `Master/Designer/${packageName.replace(
            /[^a-zA-Z0-9.-]/g,
            "_"
          )}-master.afdesign`,
          masterSvgBuffer
        );
      }
      if (selectedExtensions.includes("ai")) {
        zip.addFile(
          `Master/Illustrator/${packageName.replace(
            /[^a-zA-Z0-9.-]/g,
            "_"
          )}-master.ai`,
          masterSvgBuffer
        );
      }
    }

    // Add Structure.pdf and Formats.pdf to the zip
    if (selectedExtensions.includes("structure")) {
      const structurePdfPath = path.join(
        process.cwd(),
        "public",
        "documents",
        "Folders Structure.pdf"
      );
      const structurePdfBuffer = fs.readFileSync(structurePdfPath);
      zip.addFile("Folders Structure.pdf", structurePdfBuffer);
    }

    if (selectedExtensions.includes("formats")) {
      const formatsPdfPath = path.join(
        process.cwd(),
        "public",
        "documents",
        "Files Formats.pdf"
      );
      const formatsPdfBuffer = fs.readFileSync(formatsPdfPath);
      zip.addFile("Files Formats.pdf", formatsPdfBuffer);
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
      {
        error: "Failed to generate logo package",
        details: (error as Error).message,
      },
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

function generateAnimatedSvg(
  svgContent: string,
  animationType: string
): string {
  const animations = {
    loop: `
        @keyframes loop {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .loop {
          animation: loop 3s infinite ease-in-out;
        }
      `,
    bounce: `
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .bounce {
          animation: bounce 2s infinite ease-in-out;
        }
      `,
    pulse: `
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .pulse {
          animation: pulse 2s infinite ease-in-out;
        }
      `,
    swing: `
        @keyframes swing {
          20% { transform: rotate(5deg); }
          40% { transform: rotate(-5deg); }
          60% { transform: rotate(3deg); }
          80% { transform: rotate(-3deg); }
          100% { transform: rotate(0deg); }
        }
        .swing {
          animation: swing 3s infinite ease-in-out;
        }
      `,
  };

  const animationStyle = animations[animationType as keyof typeof animations];
  const animationClass = animationType;

  const styleTag = `
      <style>
        ${animationStyle}
      </style>
    `;

  // Ensure the SVG has a group element to apply the animation class
  if (!svgContent.includes("<g")) {
    svgContent = svgContent.replace(
      /<svg.*?>/,
      (match) => `${match}<g class="${animationClass}">`
    );
    svgContent = svgContent.replace(/<\/svg>/, "</g></svg>");
  } else {
    svgContent = svgContent.replace(/<g/, `<g class="${animationClass}"`);
  }

  return svgContent.replace(/<svg.*?>/, (match) => `${match}${styleTag}`);
}
