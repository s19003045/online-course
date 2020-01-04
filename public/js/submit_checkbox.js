$(document).ready(function() {
  $("#completed-checkbox").change(function() {
    let checkvalue = $("#completed-checkbox").val();
    let courseId = $("#lesson_info").attr("name");
    let lessonId = $("#lesson_info").val();
    $.ajax({
      url: `/courses/${courseId}/lessons/${lessonId}`,
      data: checkvalue,
      type: "post",
      dataType: "json",
      success: function() {
        console.log("check ok");
      }
    });
  });
});
