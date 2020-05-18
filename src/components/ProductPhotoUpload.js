import React, { useState, useCallback, useEffect } from "react";
import { DropZone, Stack, Thumbnail, Caption } from "@shopify/polaris";

const ProductPhotoUpload = ({ onChange }) => {
  const [file, setFile] = useState();

  useEffect(() => {
    if (file) {
      onChange(file);
    }
  }, [file, onChange]);

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      setFile(file => acceptedFiles[0]);
    },
    []
  );

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  const fileUpload = !file && <DropZone.FileUpload actionTitle="Add Image" />;
  const uploadedFile = file && (
    <Stack>
      <Thumbnail
        size="small"
        alt={file.name}
        source={
          validImageTypes.indexOf(file.type) > 0
            ? window.URL.createObjectURL(file)
            : "https://cdn.shopify.com/s/files/1/0757/9955/files/New_Post.png?12678548500147524304"
        }
      />
      <div>
        {file.name} <Caption>{file.size} bytes</Caption>
      </div>
    </Stack>
  );

  return (
    <DropZone allowMultiple={false} onDrop={handleDropZoneDrop}>
      {uploadedFile}
      {fileUpload}
    </DropZone>
  );
};

export default ProductPhotoUpload;
