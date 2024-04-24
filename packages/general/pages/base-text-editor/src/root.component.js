import React from "react";
const axios = window.axios.default;
function Root({ value, setEmailEditor }) {
  React.useEffect(() => {
    var editorEmail = new window.RichTextEditor("#editor-rte", {
      skin: "rounded-corner",
      url_base: window.ASSET_URL + "/js/vendors/richtexteditor",
      editorResizeMode: "none",
      file_upload_handler: function (file, callback) {
        if (file.size < 50000000) {
          const fd = new FormData();

          fd.append("folder", "editor");
          fd.append("files", file);
          axios.post("/storage/upload", fd).then(async (res) => {
            if (res) {
              const data =
                res.data?.data?.length > 0
                  ? res.data?.data.map((v) => {
                      callback(v.url);
                    })
                  : [];

              return data;
            }
          });
        }
      },
    });
    if (value) {
      editorEmail.setHTMLCode(value);
    }
    setEmailEditor(editorEmail);
  }, [value]);
  return (
    <div
      id="editor-rte"
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: "unset",
        height: 500,
      }}
    ></div>
  );
}

export default Root;
