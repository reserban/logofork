import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  DragEvent,
  useRef,
  RefObject,
} from "react";
import Image from "next/image";
import { CheckIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowUpTrayIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Radio, RadioGroup } from "@headlessui/react";
import JSZip from "jszip";
import { HexColorPicker } from "react-colorful";

type FileInputType = "vertical" | "horizontal" | "logomark" | "wordmark";
type Mode = "individual" | "archive";

const INDIVIDUAL_HEIGHT = "h-44";
const ARCHIVE_HEIGHT = "h-96";
const IMAGE_SIZE = 230;
const ARCHIVE_IMAGE_SIZE = 600;
const ARCHIVE_IMAGE_SIZE_M = 150;
const IMAGE_OPACITY = 0.6;
const ARCHIVE_IMAGE_OPACITY = 0.6;

const DROP_ZONE_CLASSES: Record<FileInputType | "archive", string> = {
  vertical: "rounded-tl-ct rounded-br-ct",
  horizontal: "rounded-tr-ct rounded-bl-ct",
  logomark: "rounded-tr-ct rounded-bl-ct",
  wordmark: "rounded-tl-ct rounded-br-ct",
  archive: "rounded-ct",
};

const MODES = [
  { label: "Individual", value: "individual" },
  { label: "Archive", value: "archive" },
];

const CustomColorPicker = ({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-white bg-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
      >
        <span className="flex items-center">
          <span
            className="w-6 h-6 rounded-full border-primary-500/20 border"
            style={{ backgroundColor: color }}
          />
        </span>
        <ChevronUpIcon className="w-4 h-4 ml-2 font-bold" strokeWidth={2} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            className="absolute border border-primary-500/20 z-[9999] bg-secondary-400 rounded-tr-ct rounded-bl-ct shadow-lg p-4 -ml-32 "
            style={{
              width: "240px",
              bottom: "110%",
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: "10px",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-4">Background Color</h3>
            <HexColorPicker color={color} onChange={onChange} />
            <input
              type="text"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="mt-4 w-full px-2 py-1 text-sm text-white bg-secondary-500 border border-primary-500/30 rounded-bl-xl rounded-tr-xl focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const truncateFileName = (fileName: string, maxLength: number) => {
  if (fileName.length <= maxLength) return fileName;
  const extension = fileName.split(".").pop();
  if (!extension) return fileName; // Add this check
  return `${fileName.substring(
    0,
    maxLength - extension.length - 8
  )}...${extension}`;
};

export default function UploadForm() {
  const packageNameInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<Record<FileInputType, File | null>>({
    vertical: null,
    horizontal: null,
    logomark: null,
    wordmark: null,
  });
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [sampleLoaded, setSampleLoaded] = useState<boolean>(false);
  const [packageName, setPackageName] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [dragging, setDragging] = useState<string | null>(null);
  const [disabledFields, setDisabledFields] = useState<string[]>([]);
  const [mode, setMode] = useState("individual");
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showPackageNameInput, setShowPackageNameInput] =
    useState<boolean>(false);
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([
    "svg",
    "eps",
    "png",
    "jpg",
    "color",
    "master",
  ]);
  const [showExtensionFilter, setShowExtensionFilter] =
    useState<boolean>(false);
  const [hoveredType, setHoveredType] = useState<
    FileInputType | "archive" | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pastedContent, setPastedContent] = useState("");
  const [pasteModalType, setPasteModalType] = useState<
    FileInputType | "archive" | null
  >(null);

  const fileInputRefs: Record<FileInputType, RefObject<HTMLInputElement>> = {
    vertical: useRef<HTMLInputElement>(null),
    horizontal: useRef<HTMLInputElement>(null),
    logomark: useRef<HTMLInputElement>(null),
    wordmark: useRef<HTMLInputElement>(null),
  };
  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  useEffect(() => {
    if (showPackageNameInput && packageNameInputRef.current) {
      packageNameInputRef.current.focus();
      packageNameInputRef.current.select();
    }
  }, [showPackageNameInput]);

  useEffect(() => {
    setHoveredType(null);
  }, [mode]);

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
  };

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];

      if (mode === "archive") {
        await handleArchiveFile(selectedFile);
      } else if (mode === "individual") {
        handleIndividualFile(selectedFile, type as FileInputType);
      }

      setShowPackageNameInput(true);
      setStatus(`File uploaded successfully`);
    }
  };

  const handleArchiveFile = async (file: File) => {
    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);
      const requiredFiles = [
        "vertical.svg",
        "horizontal.svg",
        "logomark.svg",
        "wordmark.svg",
      ];
      const foundFiles: Record<FileInputType, File | null> = {
        vertical: null,
        horizontal: null,
        logomark: null,
        wordmark: null,
      };

      const missingFiles = requiredFiles.filter(
        (fileName) => !loadedZip.file(fileName)
      );
      if (missingFiles.length === requiredFiles.length) {
        setStatus(`Files not in ZIP root: ${missingFiles.join(", ")}`);
        setShowPackageNameInput(false);
        return;
      }

      for (const fileName of requiredFiles) {
        const fileData = loadedZip.file(fileName);
        if (fileData) {
          const fileBlob = await fileData.async("blob");
          foundFiles[fileName.replace(".svg", "") as FileInputType] = new File(
            [fileBlob],
            `${fileName} (archive)`,
            { type: "image/svg+xml" }
          );
        }
      }

      setFiles((prevFiles) => ({ ...prevFiles, ...foundFiles }));
      setPackageName(file.name.replace(/\.[^/.]+$/, ""));
      setStatus("Files matched and loaded");
      setShowPackageNameInput(true);
    } catch (error) {
      console.error("Error processing ZIP file:", error);
      setStatus("Error processing ZIP file");
    }
  };

  const handleIndividualFile = (file: File, type: FileInputType) => {
    if (!file.name.endsWith(".svg")) {
      return;
    }
    setFiles((prevFiles) => ({ ...prevFiles, [type]: file }));
    setPackageName(file.name.replace(/\.[^/.]+$/, ""));

    setDisabledFields((prev) => [...prev, type]);
    setTimeout(() => {
      setDisabledFields((prev) => prev.filter((field) => field !== type));
    }, 2000);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>, type: string) => {
    event.preventDefault();
    setDragging(type);
  };

  const handleDragLeave = () => {
    setDragging(null);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, type: string) => {
    event.preventDefault();
    setDragging(null);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const selectedFile = event.dataTransfer.files[0];
      handleFileChange(
        {
          target: { files: [selectedFile] },
          currentTarget: { value: selectedFile.name },
        } as unknown as ChangeEvent<HTMLInputElement>,
        type
      );
      setStatus(`File dropped successfully`);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log("Generate button clicked");

    if (Object.values(files).every((file) => file === null)) {
      console.log("No files selected");
      return;
    }

    setStatus("Generating logo package...");
    setIsGenerating(true);

    const formData = new FormData();
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });
    formData.append("packageName", packageName.toLowerCase());
    formData.append("extensions", selectedExtensions.join(","));
    formData.append("backgroundColor", selectedColor);

    console.log("Selected background color:", selectedColor);

    try {
      const response = await fetch("/api/generate-logo-package", {
        method: "POST",
        body: formData,
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${packageName.toLowerCase()}-logo-package.zip`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setStatus("Logo package downloaded!");
    } catch (error) {
      console.error("Error during logo package generation:", error);
      setStatus(
        `Error: ${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileSelectClick = (type: FileInputType) => {
    if (!disabledFields.includes(type)) {
      fileInputRefs[type].current?.click();
    }
  };

  const handleTrySample = async () => {
    try {
      const sampleFiles = await Promise.all([
        fetch("/photos/unzet_vertical.svg").then((res) => res.blob()),
        fetch("/photos/unzet_horizontal.svg").then((res) => res.blob()),
        fetch("/photos/unzet_logomark.svg").then((res) => res.blob()),
        fetch("/photos/unzet_wordmark.svg").then((res) => res.blob()),
      ]);

      const fileMap: Record<FileInputType, File> = {
        vertical: new File([sampleFiles[0]], "vertical.svg (archive)", {
          type: "image/svg+xml",
        }),
        horizontal: new File([sampleFiles[1]], "horizontal.svg (archive)", {
          type: "image/svg+xml",
        }),
        logomark: new File([sampleFiles[2]], "logomark.svg (archive)", {
          type: "image/svg+xml",
        }),
        wordmark: new File([sampleFiles[3]], "wordmark.svg (archive)", {
          type: "image/svg+xml",
        }),
      };

      setFiles(fileMap);
      setPackageName("unzet");
      setStatus("Sample Loaded - Press Generate");
      setShowPackageNameInput(true);
      setSampleLoaded(true);
    } catch (error) {
      console.error("Error loading sample files:", error);
      setStatus("Error loading sample files.");
    }
  };

  const handleRefresh = () => {
    setFiles({
      vertical: null,
      horizontal: null,
      logomark: null,
      wordmark: null,
    });
    setPackageName("");
    setStatus("Selections cleared");
    setShowPackageNameInput(false);
    setSampleLoaded(false);
  };

  const handlePackageNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPackageName(event.target.value);
  };

  useEffect(() => {
    if (status && !isGenerating) {
      const timer = setTimeout(() => {
        setStatus("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, isGenerating]);

  const renderFileInput = (type: FileInputType) => {
    const isSelected = !!files[type];
    const isDisabled = disabledFields.includes(type);
    const fileName = files[type]?.name.includes("(archive)")
      ? `${type}.svg`
      : files[type]?.name;

    const truncatedFileName = fileName ? truncateFileName(fileName, 20) : "";

    const handleClearFile = (e: React.MouseEvent) => {
      e.stopPropagation();
      setFiles((prevFiles) => ({ ...prevFiles, [type]: null }));
      setStatus(`${type.charAt(0).toUpperCase() + type.slice(1)} cleared`);
    };

    return (
      <div
        key={type}
        className={`relative w-full ${INDIVIDUAL_HEIGHT} border-2 ${
          isSelected
            ? "bg-primary-500/20 border-solid border-primary-500 hover:scale-102 duration-500"
            : "bg-secondary-400/60 border-dashed border-primary-500/40 hover:border-solid hover:border-primary-500/30 hover:bg-primary-500/10 hover:scale-102 duration-500 cursor-pointer"
        } ${DROP_ZONE_CLASSES[type]} ${
          dragging === type ? "animate-drop-hover" : ""
        }`}
        onDragOver={(event) => handleDragOver(event, type)}
        onDragLeave={handleDragLeave}
        onDrop={(event) => handleDrop(event, type)}
        onMouseEnter={() => setHoveredType(type)}
        onMouseLeave={() => setHoveredType(null)}
      >
        <input
          type="file"
          accept=".svg"
          onChange={(event) => handleFileChange(event, type)}
          className="hidden"
          ref={fileInputRefs[type]}
          disabled={isDisabled}
        />
        <label
          htmlFor={`file-upload-${type}`}
          className="block text-center w-full h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {isSelected ? (
            <div className="flex flex-col justify-center items-center h-full relative">
              <ClipboardDocumentCheckIcon
                className="h-10 w-10 text-primary-500"
                style={{ opacity: 1 }}
              />
              <div className="flex items-center mt-2 -mr-2">
                <span className="text-white text-md capitalize">
                  {type.charAt(0).toUpperCase() + type.slice(1)} selected
                </span>
                <XMarkIcon
                  className="ml-1 w-4 h-4 text-white cursor-pointer hover:text-primary-500 hover:scale-105 duration-500"
                  onClick={handleClearFile}
                />
              </div>
              <span className="text-white text-xs mt-1">
                {truncatedFileName}
              </span>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              {hoveredType === type ? null : (
                <Image
                  src={`/photos/${type}.svg`}
                  alt={`${type} logo`}
                  width={IMAGE_SIZE}
                  height={IMAGE_SIZE}
                  className={`mx-auto `}
                  style={{ opacity: IMAGE_OPACITY }}
                />
              )}
              {hoveredType === type && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white/60 text-lg mb-4">
                    {hoveredType?.charAt(0).toUpperCase() +
                      hoveredType?.slice(1)}
                  </span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="px-4 flex py-2 border border-primary-500/20 hover:bg-primary-500/10 rounded-tl-xl rounded-br-xl text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        fileInputRefs[type].current?.click();
                      }}
                    >
                      <ArrowUpTrayIcon className="w-4 mt-1 mr-2 h-4 text-primary-500" />{" "}
                      Upload
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 flex hover:bg-primary-500/10 border-primary-500/20 rounded-tr-xl rounded-bl-xl border text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        openPasteModal(type);
                      }}
                    >
                      <ClipboardDocumentCheckIcon className="w-4 mt-1 mr-2 h-4 text-primary-500" />{" "}
                      Paste
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </label>
      </div>
    );
  };

  const renderArchiveInput = () => {
    const isSelected = Object.values(files).some(
      (file) => file !== null && file.name.includes("(archive)")
    );

    const handleClearArchive = (e: React.MouseEvent) => {
      e.stopPropagation();
      setFiles({
        vertical: null,
        horizontal: null,
        logomark: null,
        wordmark: null,
      });
      setStatus("Archive cleared");
    };

    return (
      <div
        id="archive-option"
        className={`relative w-full ${ARCHIVE_HEIGHT} border-2 ${
          isSelected
            ? "bg-primary-500/20 border-solid border-primary-500 hover:scale-102 duration-500"
            : "bg-secondary-400/60 border-dashed border-primary-500/40 hover:border-solid hover-border-primary-500/30 hover:bg-primary-500/10 hover:scale-102 duration-500"
        } ${
          DROP_ZONE_CLASSES["archive"]
        } transition-all duration-300 ease-in-out`}
        onDragOver={(event) => {
          event.preventDefault();
          setHoveredType("archive");
        }}
        onDragLeave={() => setHoveredType(null)}
        onDrop={(event) => {
          event.preventDefault();
          setHoveredType(null);
          if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            handleFileChange(
              {
                target: { files: event.dataTransfer.files },
                currentTarget: { value: event.dataTransfer.files[0].name },
              } as unknown as ChangeEvent<HTMLInputElement>,
              "vertical"
            );
          }
        }}
        onMouseEnter={() => setHoveredType("archive")}
        onMouseLeave={() => setHoveredType(null)}
      >
        <input
          type="file"
          accept=".zip"
          onChange={(event) => handleFileChange(event, "vertical")}
          className="hidden"
          ref={fileInputRefs["vertical"]}
        />
        <div className="absolute inset-0 flex items-center justify-center -mt-6">
          {isSelected ? (
            <div className="flex flex-col items-center">
              <ClipboardDocumentCheckIcon
                className="h-16 w-16 text-primary-500"
                style={{ opacity: 1 }}
              />
              <div className="flex items-center mt-2 -mr-3">
                <span className="text-white text-xl capitalize cursor-default">
                  Archive Selected
                </span>
                <XMarkIcon
                  className="ml-1 w-4 h-4 text-white cursor-pointer hover:text-primary-500"
                  onClick={handleClearArchive}
                />
              </div>
              <div className="flex flex-wrap justify-center gap-x-2 mt-2 text-white text-sm cursor-default">
                {Object.entries(files).map(
                  ([key, file]) =>
                    file &&
                    file.name.includes("(archive)") && (
                      <span key={key}>{key}.svg</span>
                    )
                )}
              </div>
            </div>
          ) : (
            <>
              <Image
                src={
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? "/photos/zipm.svg"
                    : "/photos/zip.svg"
                }
                alt="archive logo"
                width={
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? ARCHIVE_IMAGE_SIZE_M
                    : ARCHIVE_IMAGE_SIZE
                }
                height={
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? ARCHIVE_IMAGE_SIZE_M
                    : ARCHIVE_IMAGE_SIZE
                }
                className={`transition-opacity duration-300 ${
                  hoveredType === "archive" ? "opacity-0" : ""
                }`}
                style={{
                  opacity:
                    hoveredType === "archive" ? 0 : ARCHIVE_IMAGE_OPACITY,
                }}
              />
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${
                  hoveredType === "archive" ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="text-white/60 text-2xl mb-4 cursor-default">
                  Archive
                </span>
                <button
                  type="button"
                  className="px-4 flex py-2 border text-xl border-primary-500/20 text-white rounded-tl-xl rounded-br-xl hover:bg-primary-500/10 transition-colors duration-300 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fileInputRefs["vertical"].current?.click();
                  }}
                >
                  <ArrowUpTrayIcon className="w-5 mt-1 mr-2 h-5 text-primary-500" />{" "}
                  Upload
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const handleFilterIconClick = () => {
    setShowExtensionFilter((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showExtensionFilter &&
        !document
          .getElementById("extension-filter")
          ?.contains(event.target as Node) &&
        !document.getElementById("filter-icon")?.contains(event.target as Node)
      ) {
        setShowExtensionFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExtensionFilter]);

  const handlePaste = () => {
    if (pasteModalType && pastedContent) {
      const isSVG =
        pastedContent.trim().startsWith("<svg") ||
        pastedContent.trim().startsWith("<?xml");
      if (isSVG) {
        const blob = new Blob([pastedContent], { type: "image/svg+xml" });
        const file = new File([blob], `${pasteModalType}.svg`, {
          type: "image/svg+xml",
        });

        if (pasteModalType === "archive") {
          handleArchiveFile(file);
        } else {
          handleIndividualFile(file, pasteModalType);
        }

        setShowPackageNameInput(true);
        setStatus(`Logo pasted successfully`);
      } else {
        setStatus("Pasted content is not a valid SVG.");
      }
    }
    setIsModalOpen(false);
    setPastedContent("");
  };

  const openPasteModal = (type: FileInputType | "archive") => {
    setPasteModalType(type);
    setIsModalOpen(true);
  };

  const PasteModal = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (isModalOpen && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, []);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const modal = document.getElementById("paste-modal");
        if (modal && !modal.contains(event.target as Node)) {
          setIsModalOpen(false);
        }
      };

      if (isModalOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div
        id="paste-modal"
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
          isModalOpen ? "block" : "hidden"
        }`}
        style={{ zIndex: 9999 }}
        onClick={() => setIsModalOpen(false)}
      >
        <div
          className="bg-secondary-400 px-6 py-6 rounded-tr-ct rounded-bl-ct border border-primary-500/20 shadow-lg w-72"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-medium mb-1 text-primary-500 ">
            Logo Content
          </h2>
          <p className="mb-5 text-md">SVG, Designer or Illustrator</p>
          <textarea
            ref={textareaRef}
            value={pastedContent}
            onChange={(e) => setPastedContent(e.target.value)}
            className="w-full h-16 bg-secondary-400 text-white border border-primary-500/20 rounded-bl-xl rounded-tr-xl p-2 focus:outline-none focus:ring-2 mb-1 focus:ring-primary-500/40"
            placeholder="Paste your Logo here..."
            style={{ resize: "none" }}
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handlePaste();
            }}
            className="px-12 py-2 bg-primary-500 mt-3 font-semibold text-secondary-400 rounded-bl-lg rounded-tr-lg hover:bg-primary-400"
          >
            Done
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="max-w-4xl mx-auto px-4 pt-8 sm:pt-0 text-center">
      <span className=" sm:hidden text-center text-white font-semibold text-4xl sm:px-0">
        <ComputerDesktopIcon className="h-20 w-20 text-primary-500 mt-40 mx-auto mb-4" />
        Packer is only<br></br> available{" "}
        <span className="text-primary-500">on desktop.</span>
      </span>

      <div className="hidden sm:inline">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-2 no-select"
        >
          <PasteModal />
          <h1 className="text-4xl max-w-md text-center mb-6 mt-4 align center font-bold tracking-tight text-white sm:text-6xl">
            <span>
              Pack Your Logos{" "}
              <span className="text-primary-500">In Seconds</span>
            </span>
          </h1>
          <div className="flex justify-center">
            <fieldset
              aria-label="Project type"
              className="flex items-center ml-10 mb-4"
            >
              <RadioGroup
                value={mode}
                onChange={setMode}
                className="bg-secondary-400 ml-7 grid grid-cols-2 gap-x-1 rounded-bl-xl rounded-tr-xl p-1.5 text-center text-sm font-semibold mb-2 leading-5 ring-1 ring-inset ring-primary-500/30"
              >
                {MODES.map((option) => (
                  <Radio
                    key={option.value}
                    value={option.value}
                    className={({ checked }) =>
                      checked
                        ? "bg-primary-500 text-secondary-400 cursor-pointer rounded-bl-lg rounded-tr-lg px-2.5 py-1"
                        : "text-white cursor-pointer rounded-bl-lg rounded-tr-lg px-2.5 py-1 hover:text-primary-500 hover:scale-95 duration-500"
                    }
                  >
                    {option.label}
                  </Radio>
                ))}
              </RadioGroup>
              <ArrowPathIcon
                className="ml-4 w-5 h-5 -mt-2 text-white cursor-pointer hover:text-primary-500 hover:scale-105 duration-500"
                onClick={handleRefresh}
              />
              <div className="relative">
                <FunnelIcon
                  id="filter-icon"
                  className="ml-3 w-5 h-5 -mt-2 text-white cursor-pointer hover:text-primary-500 hover:scale-105 duration-500"
                  onClick={handleFilterIconClick}
                />
                <AnimatePresence>
                  {showExtensionFilter && (
                    <motion.div
                      id="extension-filter"
                      className="absolute right-0 mt-5 w-72  bg-secondary-400 py-4 pl-4 px-4 rounded-tl-3xl rounded-br-3xl border-primary-500/20 shadow-lg z-10 border"
                      onClick={(e) => e.stopPropagation()}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="ml-3 grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-white text-lg mb-1 text-left">
                            Vector
                          </h3>
                          {["svg", "eps", "afdesign", "ai"].map((ext) => (
                            <div key={ext} className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                id={`checkbox-${ext}`}
                                checked={selectedExtensions.includes(ext)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (ext !== "svg") {
                                    setSelectedExtensions((prev) =>
                                      prev.includes(ext)
                                        ? prev.filter((e) => e !== ext)
                                        : [...prev, ext]
                                    );
                                  }
                                }}
                                className="hidden"
                              />
                              <label
                                htmlFor={`checkbox-${ext}`}
                                className="flex items-center cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span
                                  className={`w-5 h-5 inline-block mr-2 rounded border ${
                                    selectedExtensions.includes(ext)
                                      ? ext === "svg"
                                        ? "bg-primary-700 border-primary-700"
                                        : "bg-primary-500 border-primary-500"
                                      : "bg-secondary-400 border-primary-500/20"
                                  }`}
                                  style={{ borderWidth: "1px" }}
                                >
                                  {selectedExtensions.includes(ext) && (
                                    <svg
                                      className="w-4 h-4 text-secondary-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                      style={{ margin: "auto" }}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      ></path>
                                    </svg>
                                  )}
                                </span>
                                <span className="text-white">
                                  {ext.toUpperCase()}
                                </span>
                              </label>
                            </div>
                          ))}
                          <h3 className="text-white text-lg mb-2 mt-4 text-left">
                            Raster
                          </h3>
                          {["png", "jpg", "webp", "tiff"].map((ext) => (
                            <div key={ext} className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                id={`checkbox-${ext}`}
                                checked={selectedExtensions.includes(ext)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setSelectedExtensions((prev) =>
                                    prev.includes(ext)
                                      ? prev.filter((e) => e !== ext)
                                      : [...prev, ext]
                                  );
                                }}
                                className="hidden"
                              />
                              <label
                                htmlFor={`checkbox-${ext}`}
                                className="flex items-center cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span
                                  className={`w-5 h-5 inline-block mr-2 rounded border ${
                                    selectedExtensions.includes(ext)
                                      ? "bg-primary-500 border-primary-500"
                                      : "bg-secondary-400 border-primary-500/20"
                                  }`}
                                  style={{ borderWidth: "1px" }}
                                >
                                  {selectedExtensions.includes(ext) && (
                                    <svg
                                      className="w-4 h-4 text-secondary-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                      style={{ margin: "auto" }}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      ></path>
                                    </svg>
                                  )}
                                </span>
                                <span className="text-white">
                                  {ext.toUpperCase()}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                        <div>
                          <h3 className="text-white text-lg mb-2 text-left">
                            Colors
                          </h3>
                          {["Color", "Black", "White"].map((color) => (
                            <div key={color} className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                id={`checkbox-${color}`}
                                checked={selectedExtensions.includes(
                                  color.toLowerCase()
                                )}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (color !== "Color") {
                                    setSelectedExtensions((prev) =>
                                      prev.includes(color.toLowerCase())
                                        ? prev.filter(
                                            (e) => e !== color.toLowerCase()
                                          )
                                        : [...prev, color.toLowerCase()]
                                    );
                                  }
                                }}
                                className="hidden"
                              />
                              <label
                                htmlFor={`checkbox-${color}`}
                                className="flex items-center cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span
                                  className={`w-5 h-5 inline-block mr-2 rounded border ${
                                    selectedExtensions.includes(
                                      color.toLowerCase()
                                    )
                                      ? color === "Color"
                                        ? "bg-primary-700 border-primary-700"
                                        : "bg-primary-500 border-primary-500"
                                      : "bg-secondary-400 border-primary-500/20"
                                  }`}
                                  style={{ borderWidth: "1px" }}
                                >
                                  {selectedExtensions.includes(
                                    color.toLowerCase()
                                  ) && (
                                    <svg
                                      className="w-4 h-4 text-secondary-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                      style={{ margin: "auto" }}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      ></path>
                                    </svg>
                                  )}
                                </span>
                                <span className="text-white">{color}</span>
                              </label>
                            </div>
                          ))}
                          <h3 className="text-white text-lg mb-2 mt-4 text-left">
                            Extras
                          </h3>
                          {[
                            "Master",
                            "Favicons",
                            "Motion",
                            "Formats",
                            "Structure",
                          ].map((extra) => (
                            <div key={extra} className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                id={`checkbox-${extra}`}
                                checked={selectedExtensions.includes(
                                  extra.toLowerCase()
                                )}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setSelectedExtensions((prev) =>
                                    prev.includes(extra.toLowerCase())
                                      ? prev.filter(
                                          (e) => e !== extra.toLowerCase()
                                        )
                                      : [...prev, extra.toLowerCase()]
                                  );
                                }}
                                className="hidden"
                              />
                              <label
                                htmlFor={`checkbox-${extra}`}
                                className="flex items-center cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span
                                  className={`w-5 h-5 inline-block mr-2 rounded border ${
                                    selectedExtensions.includes(
                                      extra.toLowerCase()
                                    )
                                      ? "bg-primary-500 border-primary-500"
                                      : "bg-secondary-400 border-primary-500/20"
                                  }`}
                                  style={{ borderWidth: "1px" }}
                                >
                                  {selectedExtensions.includes(
                                    extra.toLowerCase()
                                  ) && (
                                    <svg
                                      className="w-4 h-4 text-secondary-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                      style={{ margin: "auto" }}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      ></path>
                                    </svg>
                                  )}
                                </span>
                                <span className="text-white">{extra}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                        <div className="col-span-2 flex gap-x-12">
                          <a
                            className="flex -mt-3 text-sm font-semibold leading-6 text-white transition-all duration-500 transform gap-x-0.5 hover:gap-x-1 hover:scale-105 hover:text-primary-500 cursor-pointer"
                            onClick={() =>
                              setSelectedExtensions([
                                "svg",
                                "eps",
                                "afdesign",
                                "ai",
                                "png",
                                "jpg",
                                "webp",
                                "tiff",
                                "color",
                                "black",
                                "white",
                                "master",
                                "favicons",
                                "motion",
                                "formats",
                                "structure",
                              ])
                            }
                          >
                            {" "}
                            <CheckIcon className="w-4 mt-0.5 h-4" />
                            Check All
                          </a>
                          <a
                            className="flex ml-1 -mt-3 text-sm font-semibold leading-6 text-white transition-all duration-500 transform gap-x-0.5 hover:gap-x-1 hover:scale-105 hover:text-primary-500 cursor-pointer"
                            onClick={() =>
                              setSelectedExtensions(["svg", "color"])
                            }
                          >
                            <XMarkIcon className="w-4 mt-1 h-4" />
                            Uncheck All
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </fieldset>
          </div>

          <motion.div
            key={mode}
            initial={isFirstRender ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full mt-1"
          >
            {mode === "individual" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full px-2">
                {(
                  ["vertical", "horizontal", "logomark", "wordmark"] as const
                ).map(renderFileInput)}
              </div>
            )}

            {mode === "archive" && (
              <div className="w-full px-2">{renderArchiveInput()}</div>
            )}
          </motion.div>

          <div
            className={`${
              showPackageNameInput ? "opacity-100" : "opacity-0"
            } w-full max-w-2xs mt-4 transition-opacity duration-300 ease-in-out`}
            style={{ height: showPackageNameInput ? "auto" : "0px" }}
          >
            {showPackageNameInput && (
              <motion.div
                initial={isFirstRender ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-row border border-primary-500/20 rounded-tr-xl rounded-bl-xl sm:flex-row whitespace-nowrap justify-center mt-3 mb-7 gap-y-4 -mr-0  gap-x-2">
                  <div className="flex-grow">
                    <input
                      type="text"
                      id="package-name"
                      ref={packageNameInputRef}
                      value={packageName}
                      onChange={handlePackageNameChange}
                      className="w-full px-3 py-2 bg-secondary-400 rounded-bl-xl border-r border-primary-500/20  text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-transparent"
                      placeholder="Package Name"
                    />
                  </div>
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <CustomColorPicker
                      color={selectedColor}
                      onChange={setSelectedColor}
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      type="submit"
                      className={`w-full sm:w-auto cursor-pointer rounded-tr-xl bg-primary-500 px-2.5 py-2.5 text-sm font-bold text-secondary-400 shadow-sm hover:bg-primary-500/5 hover:border-primary-500/60 hover:text-primary-500 border-primary-500/20 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 duration-500 hover:scale-102 ${
                        !showPackageNameInput ||
                        Object.values(files).every((file) => file === null)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={
                        !showPackageNameInput ||
                        Object.values(files).every((file) => file === null)
                      }
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {!sampleLoaded && !showPackageNameInput && (
            <motion.div
              initial={isFirstRender ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <a
                onClick={handleTrySample}
                className="py-2 flex mb-8 mt-1 text-sm font-semibold leading-6 text-white transition-all duration-500 transform gap-x-0.5 hover:gap-x-1 hover:scale-105 hover:text-primary-500 cursor-pointer"
              >
                Try a Sample
                <ChevronRightIcon className="w-4 mt-1 h-4" />
              </a>
            </motion.div>
          )}

          <div
            className="relative w-full flex justify-center items-center"
            style={{ minHeight: "40px" }}
          >
            <AnimatePresence>
              {status && (
                <motion.div
                  key="status"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className="absolute bg-secondary-400 text-white border border-primary-500/20 text-sm px-4 py-2 -mt-4 rounded-tr-xl rounded-bl-xl shadow-lg z-100 flex justify-center items-center gap-2"
                  style={{
                    minHeight: "40px",
                    width: "fit-content",
                    padding: "0 16px",
                  }}
                >
                  {isGenerating && (
                    <ArrowPathIcon className="h-5 w-5 animate-spin text-primary-500" />
                  )}
                  <span>{status}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </section>
  );
}
