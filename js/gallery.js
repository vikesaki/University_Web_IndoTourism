$(document).ready(function() {
    $("#gallery").lightGallery();
});

// empty array for link
var images = [];

// go to location and loop all picture
for (var i = 1; i <= 12; i++) {
    var src = 'img/1/' + i + '.jpg';
    images.push({ src: src, thumb: src, subHtml: ' ' });
}

// add to the gallery
images.forEach(function(image) {
    var link = document.createElement('a');
    link.href = image.src;
    link.setAttribute('data-sub-html', image.subHtml);

    var img = document.createElement('img');
    img.src = image.thumb;
    link.appendChild(img);

    document.querySelector('#gallery').appendChild(link);
});
