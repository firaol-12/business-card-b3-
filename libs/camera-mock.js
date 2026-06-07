// libs/camera-mock.js
export const mockWithVideo = (path) => {
  // Keep track of existing button
  let existingButton = null;
  
  // Override getUserMedia
  navigator.mediaDevices.getUserMedia = () => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      
      // Set video attributes
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = "anonymous";
      video.src = path;
      
      // Load the video
      video.load();
      
      video.oncanplaythrough = () => {
        console.log("Video loaded, checking for existing button");
        
        // Remove any existing button first
        if (existingButton && document.body.contains(existingButton)) {
          document.body.removeChild(existingButton);
          existingButton = null;
        }
        
        // Create start button - TOP LEFT CORNER
        const startButton = document.createElement("button");
        startButton.innerHTML = "Start Mock Video";
        startButton.style.position = 'fixed';
        startButton.style.top = '20px';
        startButton.style.left = '20px';
        startButton.style.zIndex = '10000';
        startButton.style.padding = '10px 20px';
        startButton.style.fontSize = '16px';
        startButton.style.backgroundColor = '#4CAF50';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.cursor = 'pointer';
        
        // Store reference to button
        existingButton = startButton;
        document.body.appendChild(startButton);
        console.log("Button created and appended to top-left corner");
        
        startButton.addEventListener('click', () => {
          console.log("Start button clicked, playing video");
          
          // Play the video
          video.play()
            .then(() => {
              // Capture stream and resolve
              const stream = video.captureStream();
              
              // Remove button and clear reference
              if (existingButton && document.body.contains(existingButton)) {
                document.body.removeChild(existingButton);
                existingButton = null;
              }
              
              console.log("Stream resolved, button removed");
              resolve(stream);
            })
            .catch(err => {
              console.error("Error playing video:", err);
              reject(err);
            });
        });
      };
      
      video.onerror = (err) => {
        console.error("Video loading error:", err);
        reject(err);
      };
    });
  };
};

export const mockWithImage = (path) => {
  navigator.mediaDevices.getUserMedia = () => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext('2d');

      const image = new Image();
      image.onload = () => {
	canvas.width = image.width;
	canvas.height = image.height;
	context.drawImage(image, 0, 0, image.width, image.height);
	const stream = canvas.captureStream();
	resolve(stream);
      }
      image.src = path;
    });
  };
}
