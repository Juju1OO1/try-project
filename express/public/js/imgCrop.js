var imgNewWidth = 800;  // px
var imgNewHeight;
var imgNewSize = 150;  // k
var $t = $('#tailoringImg');
var cropper;
var croppedImages = [];

// 當上傳圖片改變時初始化裁切器
$('#upload').change(function() {
    let file = this.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(evt) {
            let imgSrc = evt.target.result;
            if (cropper) {
                cropper.destroy();
            }
            $t.attr('src', imgSrc);
            initCropper();
        }
        reader.readAsDataURL(file);
    }
});

// 初始化 Cropper
function initCropper() {
    cropper = new Cropper($t[0], {
        aspectRatio: NaN,
        preview: '#previewImg',
        guides: false,
        autoCropArea: 0.5,
        dragMode: 'crop',
        cropBoxResizable: true,
        movable: true,
        zoomable: false,
        rotatable: false,
        zoomOnWheel: true,
        zoomOnTouch: true,
        ready: function(e) {
            console.log('ready!');
        }
    });
}

// 點擊「Crop & Compress」按鈕時裁切圖片
$('#sureCut').click(function() {
    if (!$t.attr("src")) {
        return false;
    }

    var cropImg = cropper.getData();
    imgNewHeight = Math.round(imgNewWidth * cropImg.height / cropImg.width);

    var cvs = cropper.getCroppedCanvas({
        width: imgNewWidth,
        height: imgNewHeight
    });

    var base64 = cvs.toDataURL('image/jpeg');
    var compressRatio = 102;

    var img = new Image();
    img.src = base64;
    img.onload = function() {
        var newImg;
        
        // 壓縮圖片
        do {
            compressRatio -= 2;
            newImg = cvs.toDataURL("image/jpeg", compressRatio / 100);
        } while (Math.round(0.75 * newImg.length / 1000) > imgNewSize);

        // 添加縮圖到預覽列表
        addThumbnail(newImg);

        // 儲存裁切後圖片的 URL
        croppedImages.push(newImg);
    };
});

// 增加縮圖到預覽列表
function addThumbnail(url) {
    const previewList = document.getElementById('previewList');
    
    const thumbElement = document.createElement('img');
    thumbElement.src = url;
    thumbElement.classList.add('thumbnail');
    thumbElement.addEventListener('click', function() {
        displayFullImage(url);
    });

    previewList.appendChild(thumbElement);
}

// 顯示完整圖片
function displayFullImage(url) {
    const fullImageElement = document.getElementById('fullImage');
    fullImageElement.src = url;
}


//將裁減的圖片發送到後端
$('#saveAllBtn').click(async function() {
    for (let i = 0; i < croppedImages.length; i++) {
        let imgDataUrl = croppedImages[i];
        let blob = await (await fetch(imgDataUrl)).blob(); // 將圖片轉為 Blob 格式
        let formData = new FormData();
        formData.append("image", blob, `cropped_image_${i + 1}.png`);

        // 發送到後端儲存
        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log("Image saved:", data);
        })
        .catch(error => {
            console.error("Error saving image:", error);
        });
    }
    alert("已儲存");
});