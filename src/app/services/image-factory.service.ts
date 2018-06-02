import { Injectable } from '@angular/core';

@Injectable()
export class ImageFactoryService {
  video: any;
  canvas: any;

  width = 1 * 400;
  height = 1 * 300;
  constructor() {
    //createElement('video');
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }


  startVideoStream() {
    this.video = document.querySelector('#video');
    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices.getUserMedia({ video: this.getConstraints() }).then(stream => {
        this.video.src = window.URL.createObjectURL(stream);
        this.video.play();
      });
    }
  }


  getLucky() {
    const dataUri = this.getCanvas().toDataURL('image/jpeg');
    const data = dataUri.split(',')[1];

    const bytes = window.atob(data);
    const buf = new ArrayBuffer(bytes.length);
    const byteArr = new Uint8Array(buf);

    for (let i = 0; i < bytes.length; i++) {
      byteArr[i] = bytes.charCodeAt(i);
    }

    const uInt8Array = new Uint8Array(bytes.length);

    for (let i = 0; i < bytes.length; ++i) {
      uInt8Array[i] = bytes.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: 'image/jpeg' });
  }

  getCanvas() {
    this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.width, this.height);
    return this.canvas;
  }

  getImageData(): any {
    this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.width, this.height);
    return this.canvas.toDataURL().split(',')[1];
  }

  getImageBlob() {
    const dataURL = this.getImageData();
    const BASE64_MARKER = ';base64,';
    let parts;
    let contentType;
    let raw;
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      parts = dataURL.split(',');
      contentType = parts[0].split(':')[1];
      raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: contentType });
    }
    parts = dataURL.split(BASE64_MARKER);
    contentType = parts[0].split(':')[1];
    raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }

  stopVideoStream(): void {
    this.video.stop();
  }


  getConstraints(width: number = this.width, height: number = this.height) {
    return { width, height };
  }
}
