$(document).ready(function () {
  // ==========text rich editor============

  hljs.configure({
    languages: ["javascript", "ruby", "python"] // optionally configure hljs
  });
  var toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],  // 空陣列會有 36 種 colors
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean'],   // remove formatting button
    ['link', 'image'],
    // ['video']
  ];
  // imgur api
  var IMGUR_CLIENT_ID = "08e5c002648209f";
  var IMGUR_API_URL = "https://api.imgur.com/3/image";

  // Add fonts to whitelist
  // var Font = Quill.import('formats/font');
  // // We do not add Sans Serif since it is the default
  // Font.whitelist = ['inconsolata', 'roboto', 'mirza', 'arial'];
  // Quill.register(Font, true);

  var options = {
    debug: "info",
    modules: {
      toolbar: toolbarOptions,
      history: {
        // Enable with custom configurations
        delay: 2500,
        userOnly: true
      },
      syntax: true // Enable with default configuration
    },
    placeholder: "Compose an epic...",
    // readOnly: true,
    theme: "snow"
  };

  var editor = new Quill("#editor", options);
  var Clipboard = Quill.import("modules/clipboard");
  var Delta = Quill.import("delta");

  var showLinkUI = function (value) {
    if (value) {
      var href = prompt("Enter the URL");
      this.quill.format("link", href);
    } else {
      this.quill.format("link", false);
    }
  };
  var toolbar = editor.getModule("toolbar");
  toolbar.addHandler("link", showLinkUI);
  let noUpdateInProgress = true;
  // 將image上傳至IMGUR
  function quillFormImgListener(formSelector) {
    // eslint-disable-line no-unused-vars
    var $form = $(formSelector);
    $form.onchange(
      "blur change keyup paste input",
      "[contenteditable]",
      function () {
        if (noUpdateInProgress) {
          var $images = $("#editor img");
          $images.each(function () {
            var imageSrc = $(this).attr("src");
            if (imageSrc && imageSrc[0] === "d") {
              console.log("Starting image upload...");
              noUpdateInProgress = false;
              disableSubmit($form);
              uploadImageToImgurAndReplaceSrc($(this), enableSubmit);
            }
          });
        }
      }
    );
  }
  function uploadImageToImgurAndReplaceSrc($image) {
    var imageBase64 = $image.attr("src").split(",")[1];
    $("#progressbar").show();
    $.ajax({
      url: IMGUR_API_URL,
      type: "post",
      data: {
        image: imageBase64
      },
      headers: {
        Authorization: "Client-ID " + IMGUR_CLIENT_ID
      },
      dataType: "json",
      xhr: function () {
        var xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = function (e) {
          console.log(e.loaded);
          if (e.lengthComputable) {
            $("#progressbar").attr({ value: e.loaded, max: e.total });
            // Upload finished
            if (e.loaded == e.total) {
              $("#progressbar").attr("value", e.total);
            }
          }
        };
        return xhr;
      },
      success: response => {
        $image.attr("src", response.data.link);
        $("#progressbar").hide();
        $("#progressbar").attr("value", 0);
      },
      error: (xhr, type, err) => {
        console.error(err);
        alert("Sorry we couldn't upload your image to Imgur.");
        $("#progressbar").hide();
      }
    });
  }

  editor.on("editor-change", () => {
    var $images = $("#editor img");
    $images.each(function () {
      var imageSrc = $(this).attr("src");
      if (imageSrc && imageSrc[0] === "d") {
        uploadImageToImgurAndReplaceSrc($(this));
      }
    });
  });

  // 將 editor 中編輯的內容放入 textarea 再 submit
  $("#identifier").on("submit", function (event) {
    $("#hiddenArea").val(editor.root.innerHTML);
  });

  // ========jQuery 的 draggable=======
  $(".droppable-area1").sortable({
    connectWith: ".connected-sortable",
    stack: ".connected-sortable ul",
    stop: function (event, ui) {
      // 取得 courses-tbody 的子代長度
      trLength = $(".courses-tbody").children().length;

      const axiosReq = [];

      for (let x = 1; x <= trLength; x++) {
        // try {
        // 變更 li 的章節(依排序)
        $(`.courses-tbody li:nth-child(${x})`)
          .find("span")
          .text(`章節  ${x}`);

        // 變更 li 的 input value(同章節編號)
        $(`.courses-tbody li:nth-child(${x})`)
          .find("input.input-lessonnumber")
          .val(`${x}`);
        $(`.courses-tbody li:nth-child(${x})`)
          .find("input.input-lessonnumber")
          .attr("value", `${x}`);
        // 變更 button 的 data-lessonnumber(同章節編號)
        $(`.courses-tbody li:nth-child(${x})`)
          .find("button")
          .attr("data-lessonnumber", `${x}`);

        // 取得 li 的 input 之 data-pk 值
        var pk = $(`.courses-tbody li:nth-child(${x})`)
          .find("input")
          .data("pk");

        // 取得 li 的 input value
        var lessonNumber = $(`.courses-tbody li:nth-child(${x})`)
          .find("input")
          .val();
        // 取得 li 的 input 之 data-courseId 值
        var courseId = $(`.courses-tbody li:nth-child(${x})`)
          .find("input")
          .data("courseid");

        axiosReq.push(
          axios.post(
            `/courses/create/${courseId}/step2/editLessonNumber?_method=PUT`,
            {
              pk: pk,
              lessonNumber: lessonNumber
            }
          )
        );
      }

      console.log(axiosReq);
      // 發送多個 axios request
      axios
        .all(axiosReq)
        .then(
          axios.spread((...res) => {
            res.forEach(r => {
              console.log(r.data);
            });
          })
        )
        .catch(error => {
          console.log(error);
        });
    }
  });

  // ==========table 列的新增或刪除==========

  // 修改列的 index
  const modifyRowNumber = async function (trLength) {
    const axiosReq = [];

    for (let x = 1; x <= trLength; x++) {
      // try {
      // 變更 li 的章節(依排序)
      $(`.courses-tbody li:nth-child(${x})`)
        .find("span")
        .text(`章節  ${x}`);

      // 變更 li 的 input value(同章節編號)
      $(`.courses-tbody li:nth-child(${x})`)
        .find("input.input-lessonnumber")
        .val(`${x}`);
      $(`.courses-tbody li:nth-child(${x})`)
        .find("input.input-lessonnumber")
        .attr("value", `${x}`);
      // 變更 button 的 data-lessonnumber(同章節編號)
      $(`.courses-tbody li:nth-child(${x})`)
        .find("button")
        .attr("data-lessonnumber", `${x}`);

      // 取得 li 的 input 之 data-pk 值
      let pk = $(`.courses-tbody li:nth-child(${x})`)
        .find("input")
        .data("pk");

      // 取得 li 的 input value
      let lessonNumber = $(`.courses-tbody li:nth-child(${x})`)
        .find("input")
        .val();
      // 取得 li 的 input 之 data-courseId 值
      let courseId = $(`.courses-tbody li:nth-child(${x})`)
        .find("input")
        .data("courseid");

      axiosReq.push(
        axios.post(
          `/courses/create/${courseId}/step2/editLessonNumber?_method=PUT`,
          {
            pk: pk,
            lessonNumber: lessonNumber
          }
        )
      );
    }

    // 發送多個 axios request
    axios
      .all(axiosReq)
      .then(
        axios.spread((...res) => {
          res.forEach(r => {
            console.log(r.data);
          });
        })
      )
      .catch(error => {
        console.log(error);
      });
  };

  // 新增一列
  const addNewTr = function (trLength) {
    let courseId = $(".courses-tbody").data("courseid");

    let newNodeHtml = `
            <li class="draggable-item mb-2 py-2 d-flex justify-content-start" style="
    line-height: 50px;
">
              <span class="w-25 font-weight-bold">章節  ${trLength + 1}</span>
              <form action="/courses/create/${courseId}/step2/createLessonTitle" method="POST" class="d-flex justify-content-between my-2">
                <input class="d-none input-blank" type="text" data-pk="" data-courseid="${courseId}"
                  name="lessonNumber" value="${trLength + 1}">
                <div class="form-group">
                  <input class="d-100 form-control input-lg" style="width:300px;" type="text" data-pk="" data-courseid="${courseId}"
                  name="title" value="">
                </div>
                
                <div class="list-btn-group ml-5">
                  <button class="btn btn-link btn-sm my-0 text-danger btn-save-lessonTitle" role="" type="submit" >Save
                  </button>  
                </div>
              </form>
            </li>
        `;
    $(".courses-tbody").append(newNodeHtml);
  };

  // 登入 step 2 頁面後，立即排序
  let trLength;
  // 取得 courses-tbody 的子代長度
  trLength = $(".courses-tbody").children().length;
  modifyRowNumber(trLength);

  // 點擊 Add lesson 的 button 時，執行的動作
  $(".btn-add-lesson").click(function () {
    // 取得 tbody 的子代長度
    let trLength = $(".courses-tbody").children().length;

    if (trLength === 0) {
      addNewTr(trLength);
    } else {
      modifyRowNumber(trLength);
      addNewTr(trLength);
    }
  });

  // 點擊 remove lesson 的 button 時，執行的的動作
  // $('button.btn-remove-lesson').on('click', function (event) {
  //   // event.preventDefault();
  //   if (confirm('確定要刪除該章節(連內容都一併刪除)?')) {
  //     let courseId = $('.courses-tbody').data('courseid')
  //     // 取得 li 的 input 之 data-pk 值
  //     let pk = $("button.btn-remove-lesson").data("id");

  //     // 取得 li 的 input value
  //     let lessonNumber = $("button.btn-remove-lesson").data("lessonNumber");

  //     // let trLength;
  //     // $(this)
  //     //   .parents("li.draggable-item")
  //     //   .remove();

  //     // // 取得 courses-tbody 的子代長度
  //     // trLength = $(".courses-tbody").children().length;
  //     // ("/courses/create/:courseId/step2/editLessonNumber");


  //     // axios request
  //     axios
  //       .post(`/courses/create/${courseId}/step2/${pk}?_method=DELETE`, {
  //         lessonId: pk,
  //         lessonNumber: lessonNumber
  //       })
  //       .then(res => {
  //         console.log(res.data);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   }
  // })
  // $(".courses-tbody").on('click', 'button.btn-remove-lesson', function (event) {
  //   console.log(event)
  //   console.log(event.target)
  //   event.preventDefault();
  //   if (confirm('確定要刪除該章節(連內容都一併刪除)?')) {
  //     let courseId = $('.courses-tbody').data('courseid')
  //     // 取得 li 的 input 之 data-pk 值
  //     let pk = $(".courses-tbody")
  //       .children()
  //       .find("button.btn-remove-lesson")
  //       .data("id");
  //     // 取得 li 的 input value
  //     let lessonNumber = $(".courses-tbody")
  //       .children()
  //       .find("button.btn-remove-lesson")
  //       .data("lessonnumber");

  //     let trLength;
  //     $(this)
  //       .parents("li.draggable-item")
  //       .remove();

  //     // 取得 courses-tbody 的子代長度
  //     trLength = $(".courses-tbody").children().length;
  //     ("/courses/create/:courseId/step2/editLessonNumber");


  //     // axios request
  //     axios
  //       .post(`/courses/create/${courseId}/step2/${pk}?_method=DELETE`, {
  //         lessonId: pk,
  //         lessonNumber: lessonNumber
  //       })
  //       .then(res => {
  //         console.log(res.data);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   }
  // });
});
