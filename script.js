const GAS_API = `https://script.google.com/macros/s/AKfycbzjR8RxB8ldm9FD27al5AO9FpHp4qpyI-Zhadpi9EPoOUTahWMDFQ8ZkxzS9Bk9XtjBmg/exec`;
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('hex_k');
let downloadData = {};
if (myParam) {
  axios.get(`${GAS_API}?k=${myParam}`).then(res => {
    if (res.data.length > 0) {
      creatDraw(res.data[0]);
      downloadData = res.data[0];
    } else {
      noData();
    }
  })
} else {
  noData();
}

function noData() {
  document.querySelector('.contentArea').innerHTML = `<div class="container my-3"><h2 class="text-center"> 查無資料 </h2></div>`;
}

function creatDraw(content) {
  // 修正解析度
  const getPixelRatio = function (context) {
    const backingStore = context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  };
  let c1 = document.querySelector('#sz')
  let ctx = c1.getContext('2d')
  const ratio = getPixelRatio(ctx);

  if (window.innerWidth < 1200) {
    c1.style.width = '100%';
    c1.style.height = '100%';
  } else {
    c1.style.width = c1.width * 1.2 + 'px';
    c1.style.height = c1.height * 1.2 + 'px';
  }
  

  c1.width = c1.width * ratio;
  c1.height = c1.height * ratio;

  // 放大倍数
  ctx.scale(ratio, ratio);

  const img = new Image();
  const logo = new Image();
  img.src = `../images/template${content.template}.svg`;
  logo.src = `../images/hexschool_logo.svg`;
  img.onload = function () {
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0, c1.width , c1.height);

    ctx.drawImage(img, 0, 0, 843, 596)
    logo.onload = function () {
  
      // x 位置統一
      let xPosition = 124;
      let fontFamily = "'Noto Sans TC', sans-serif";
      let colorDark = "rgba(0, 37, 36, 1)";
      let colorBlack = "rgba(0, 0, 0, 1)";
      // 課程名稱
      
      let yStart = 205;
      ctx.textAlign = "left";
      ctx.font = `24px ${fontFamily}`;
      ctx.fillStyle = colorDark;
      ctx.fillText(`${content.course_name}`, xPosition, yStart);

      ctx.textAlign = "left";
      ctx.font = `24px ${fontFamily}`;
      ctx.fillStyle = colorDark;
      ctx.fillText(`完課證書`, xPosition, yStart + 32);

      ctx.beginPath();
      ctx.moveTo(xPosition, yStart + 32 + 24);
      ctx.lineTo(xPosition + 350, yStart + 32 + 24);
      ctx.strokeStyle = colorDark;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = `31px ${fontFamily}`;
      ctx.fillStyle = "black";
      ctx.fillText(`${content.student}`, xPosition, 318);

      ctx.font = `16px ${fontFamily}`;
      ctx.fillStyle = colorBlack;
      ctx.fillText(`${content.content}`, xPosition, 318 + 42)
      
      ctx.font = `16px ${fontFamily}`;
      ctx.fillStyle = colorBlack;
      ctx.fillText(`特頒此證 以茲證明`, xPosition, 318 + 42 + 24)

      ctx.drawImage(logo, xPosition - 6, 424, 114, 40);

      ctx.font = `14px ${fontFamily}`;
      ctx.fillStyle = colorBlack;
      ctx.fillText(`授課老師 ${content.teacher}`, xPosition, 473)

      ctx.font = `14px ${fontFamily}`;
      ctx.fillStyle = colorBlack;
      ctx.fillText(`${content.date.split('T')[0]}`, xPosition + 529, 473)
    }
  }
}

document.getElementById('saveBtn').addEventListener('click', saveImg)
function saveImg() {
  let canvas = document.querySelector('#sz')
  let downloadA = document.createElement('a');
  downloadA.setAttribute('download', `${downloadData.course_name}_獎狀.png`)
  downloadA.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  downloadA.click()
}