$(document).ready(function () {

  // ==========text rich editor============
  hljs.configure({   // optionally configure hljs
    languages: ['javascript', 'ruby', 'python']
  });
  var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': ['red', 'yellow', 'lime', 'aqua', 'blue', 'magenta', 'black', 'gray', 'green', 'maroon', 'navy', 'olive', 'purple', 'silver', 'white', 'teal'] },
    { 'background': ['red', 'yellow', 'lime', 'aqua', 'blue', 'magenta', 'black', 'gray', 'green', 'maroon', 'navy', 'olive', 'purple', 'silver', 'white', 'teal'] }],          // dropdown with defaults from theme
    [{ 'font': ['Times New Roman'] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ];

  var options = {
    debug: 'info',
    modules: {
      toolbar: toolbarOptions,
      'history': {          // Enable with custom configurations
        'delay': 2500,
        'userOnly': true
      },
      'syntax': true        // Enable with default configuration
    },
    placeholder: 'Compose an epic...',
    // readOnly: true,
    theme: 'snow'
  };
  var editor = new Quill('#editor', options);
  var Clipboard = Quill.import('modules/clipboard');
  var Delta = Quill.import('delta');

  // 將 editor 中編輯的內容放入 textarea 再 submit
  $("#identifier").on("submit", function (event) {
    $("#hiddenArea").val(editor.root.innerHTML);
  })

  // ========jQuery 的 draggable=======
  $(".droppable-area1").sortable({
    connectWith: ".connected-sortable",
    stack: '.connected-sortable ul',
    stop: function (event, ui) {
      // 取得 courses-tbody 的子代長度

      trLength = $('.courses-tbody').children().length
      for (let x = 1; x <= trLength; x++) {

        // 變更 li 的章節(依排序)
        $(`.courses-tbody li:nth-child(${x})`).find("span").text(`章節  ${x}`)

        // 變更 li 的 input value(同章節編號)
        $(`.courses-tbody li:nth-child(${x})`).find("input").val(`${x}`)
        // $(`#form - ${ x + 1 } `).submit()

        // 取得 li 的 input 之 data-pk 值
        var pk = $(`.courses-tbody li:nth-child(${x})`).find("input").data('pk')

        // 取得 li 的 input value
        var lessonNumber = $(`.courses-tbody li:nth-child(${x})`).find("input").val()
        // 取得 li 的 input 之 data-courseId 值
        var courseId = $(`.courses-tbody li:nth-child(${x})`).find("input").data('courseId')
        // 發送請求
        axios.post(`/courses/create/${courseId}/step2/editLessonNumber?_method=PUT`, {
          pk: pk,
          lessonNumber: lessonNumber
        })
          .then(function (response) {
            console.log('排序成功');
          })
          .catch(function (error) {
            console.log('排序失敗');
          })
      }
    }
  })

  // ==========table 列的新增或刪除==========
  // 修改列的 index
  var modifyRowNumber = function (trLength) {
    for (let x = 1; x <= trLength; x++) {

      // 變更 li 的章節(依排序)
      $(`.courses-tbody li:nth-child(${x})`).find("span").text(`章節  ${x}`)

      // 變更 li 的 input value(同章節編號)
      $(`.courses-tbody li:nth-child(${x})`).find("input").val(`${x}`)

      // 取得 li 的 input 之 data-pk 值
      var pk = $(`.courses-tbody li:nth-child(${x})`).find("input").data('pk')

      // 取得 li 的 input value
      var lessonNumber = $(`.courses-tbody li:nth-child(${x})`).find("input").val()
      // 取得 li 的 input 之 data-courseId 值
      var courseId = $(`.courses-tbody li:nth-child(${x})`).find("input").data('courseId')
      // 發送請求
      axios.post(`/courses/create/${courseId}/step2/editLessonNumber?_method=PUT`, {
        pk: pk,
        lessonNumber: lessonNumber
      })
        .then(function (response) {
          console.log('排序成功');
        })
        .catch(function (error) {
          console.log('排序失敗');
        })
    }
  }

  // 新增一列
  var addNewTr = function (trLength) {
    var courseId = $('.courses-tbody').data('courseid')

    var newNodeHtml = `
            <li class="draggable-item mb-2 py-2 d-flex justify-content-start">
              <span class="w-25 align-middle font-weight-bold">章節  ${trLength + 1}</span>
              <form action="/courses/create/${courseId}/step2/createLessonTitle" method="POST" class="d-flex justify-content-between my-2">
                <input class="d-none" type="text" data-pk="" data-courseId="${courseId}"
                  name="lessonNumber" value="${trLength + 1}">
                <div class="form-group">
                  <input class="d-100 form-control input-lg" style="width:300px;" type="text" data-pk="" data-courseid="${courseId}"
                  name="title" value="">
                </div>
                
                <div class="list-btn-group ml-5">
                  <button class="btn btn-link btn-sm my-0 text-danger btn-save-lessonTitle" role="">Save
                  </button>  
                </div>
              </form>
            </li>
        `
    $(".courses-tbody").append(newNodeHtml)
  }

  // 點擊新增 button 時，執行的動作
  $(".btn-add-lesson").click(function () {
    // 取得 tbody 的子代長度
    var trLength = $('.courses-tbody').children().length

    if (trLength === 0) {
      addNewTr(trLength)
    } else {
      modifyRowNumber(trLength)
      addNewTr(trLength)
    }
  })

  // 點擊 remove button 時，執行的的動作
  $(".courses-tbody").on('click', 'button.btn-remove-lesson', function () {
    if (confirm('Some message')) {
      var courseId = $('.courses-tbody').data('courseId')
      // 取得 li 的 input 之 data-pk 值
      var pk = $('.courses-tbody').children().find('button.btn-remove-lesson').data('id')
      // 取得 li 的 input value
      var lessonNumber = $('.courses-tbody').children().find('button.btn-remove-lesson').data('lessonnumber')

      var trLength
      $(this).parents('li.draggable-item').remove()

      // 取得 courses-tbody 的子代長度
      trLength = $('.courses-tbody').children().length

      modifyRowNumber(trLength)
      axios.post(`/courses/create/${courseId}/step2/${pk}?_method=DELETE`, {
        lessonId: pk,
        lessonNumber: lessonNumber
      })
        .then(function (response) {
          console.log('刪除成功');
          modifyRowNumber(trLength)
        })
        .catch(function (error) {
          console.log('刪除失敗');
        })

    } else {

    }
  })

})