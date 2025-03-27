import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AlertImagePopup = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        onClick={() => setIsOpen(true)}
        // className="img-thumbnail w-25 cursor-pointer"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {isOpen && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Bill Preview</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsOpen(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img src={src} alt={alt} className="img-fluid rounded" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertImagePopup;
