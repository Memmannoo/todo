<template>
  <editor
    v-model="editorValue"
    :init="init"
    api-key="ze9fq09ytvclplkm4s47xnt9vyw1m03t4mu5fi9s3dwpbj92"
    :id="`elm1`"
  ></editor>
</template>

<script setup>
import { reactive, ref, watch, toRefs } from "vue";

import Editor from "@tinymce/tinymce-vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  plugins: {
    type: [String, Array],
    // default: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons'
    // "quickbars advlist lists emoticons",
    default: "lists link image emoticons fullscreen",
  },
  toolbar: {
    type: [String, Array],
    default:
      "undo redo | bold italic underline strikethrough | fontsizeselect |  fontfamily fontsize blocks |  alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl | emoticons",
    // default:" bold italic underline strikethrough | fontsizeselect |  numlist bullist | forecolor backcolor | alignleft aligncenter alignright alignjustify|bullist numlist |outdent indent blockquote | undo redo | axupimgs | removeformat | emoticons",
    // default : 'styleselect | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | bullist numlist | image'
  },
});

const emit = defineEmits(["update:modelValue"]);

const init = reactive({
  selector: `textarea`,
  width: "100%",
  height: "150px",
  menubar: false,
  content_css: false,
  plugins: props.plugins,
  toolbar: props.toolbar,
  menu: "",
  quickbars_insert_toolbar: false,
  branding: false,
  toolbar_location: "top",
  auto_focus: true,
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; ul{margin-left: 80px} ol{margin-left: 80px}} ",

  setup: function (editor) {
    //this setup to put the cursor at the end when loading the editor when editor has already content
    editor.on("init", function () {
      editor.focus(); //focus when intialize in the first
      editor.selection.select(editor.getBody(), true); //begin in selecting all content, (blue selection)
      editor.selection.collapse(false); // then remove the selection and puth the cursor in the end
    });
  },

  image_title: true,
  automatic_uploads: true,
  file_picker_types: "image",
  file_picker_callback: function (cb, value, meta) {
    var input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    /*
      Note: In modern browsers input[type="file"] is functional without
      even adding it to the DOM, but that might not be the case in some older
      or quirky browsers like IE, so you might want to add it to the DOM
      just in case, and visually hide it. And do not forget do remove it
      once you do not need it anymore.
    */

    input.onchange = function () {
      var file = this.files[0];

      var reader = new FileReader();
      reader.onload = function () {
        /*
          Note: Now we need to register the blob in TinyMCEs image blob
          registry. In the next release this part hopefully won't be
          necessary, as we are looking to handle it internally.
        */
        var id = "blobid" + new Date().getTime();
        var blobCache = tinymce.activeEditor.editorUpload.blobCache;
        var base64 = reader.result.split(",")[1];
        var blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        /* call the callback and populate the Title field with the file name */
        cb(blobInfo.blobUri(), { title: file.name });
      };
      reader.readAsDataURL(file);
    };

    input.click();
  },
});

const { modelValue } = toRefs(props);
const editorValue = ref(modelValue.value);

watch(modelValue, (newValue) => {
  editorValue.value = newValue;
});

watch(editorValue, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>

<style scoped></style>