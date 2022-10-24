import React, { useEffect, useRef, useState } from "react";

class ImageLoader {
  _cleaners = {};
  _loadedImages = {};
  _timeout = null;

  loadImage = (url, callback) => {
    if (this._cleaners[url] || this._loadedImages[url]) {
      return;
    }
    const imageElement = new Image();
    imageElement.src = url;

    const handleLoad = () => {
      this._loadedImages[url] = {
        status: "loaded",
        width: imageElement.naturalWidth,
        height: imageElement.naturalHeight,
      };

      delete this._cleaners[url];

      callback?.(this._loadedImages[url]);
    };

    const handleError = () => {
      this._loadedImages[url] = {
        status: "error",
      };

      delete this._cleaners[url];

      callback?.(this._loadedImages[url]);
    };

    imageElement.addEventListener("load", handleLoad);
    imageElement.addEventListener("error", handleError);

    this._cleaners[url] = () => {
      imageElement.removeEventListener("load", handleLoad);
      imageElement.removeEventListener("error", handleError);
    };
  };

  getImageInfo = () => {
    return this._loadedImages[url] ?? { status: "not-loaded" };
  };

  cleanUp = () => {
    Object.entries(this._cleaners).forEach((clean) => clean());
  };
}

const URL = "https://picsum.photos/id/237/200/300";

export default function DynamicImageLoading() {
  const [imageInfo, setImageInfo] = useState(null);
  const targetRef = useRef(null);

  useEffect(() => {
    if (targetRef.current) {
      const imageLoader = new ImageLoader();
      const observer = new IntersectionObserver(([entry], observerInstance) => {
        if (entry.isIntersecting) {
          observerInstance.disconnect();
          // Add a small timeout so the "loading" is always visible at first
          setTimeout(() => {
            imageLoader.loadImage(URL, (imageInfo) => setImageInfo(imageInfo));
          }, 1000)
        }
      });
      observer.observe(targetRef.current);

      // Just once
      return () => {
        observer.disconnect();
        imageLoader.cleanUp();
      };
    }
  }, []);

  return (
    <article ref={targetRef}>
      <h2>Dynamic Image Loading</h2>
      <p>
        Loading and reacting to images state (load, error...) based on certain
        criteria. In this sample, using the <b>IntersectionObserver API</b> to
        detect if the images elements are visible before loading them (basically
        "lazy loading" them). But other criteria could be used (like loading
        them sequentially in order, etc).
      </p>
      {!imageInfo ? (
        <div>Loading</div>
      ) : imageInfo.status === "error" ? (
        <div>Error</div>
      ) : (
        <img
          src={URL}
          style={{ height: 200, width: 200, objectFit: "contain" }}
        />
      )}
    </article>
  );
}
