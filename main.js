import {mockWithVideo} from "./libs/camera-mock.js"
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3/+esm";// Add this line
import {CSS3DObject} from "./libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js"
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded',()=>{
    const start = async ()=>{

        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.querySelector("#container"),
            imageTargetSrc: './assets/targets (15).mind',
            uiScanning: "#scanning",
            uiLoading: "no",
        });

        const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;
        
        // 🔧 FREEZE VARIABLES
        let isFrozen = false;
        let frozenPosition = new THREE.Vector3();
        let frozenQuaternion = new THREE.Quaternion();
        let frozenScale = new THREE.Vector3();
        let cssObject = null;
        let cssAnchor = null;
        
        const imgItem = [
            {
                id: 0,
                src:"https://res.cloudinary.com/djw0srhou/image/upload/q_auto:eco,f_auto,w_240,c_scale/v1776068844/Home_1_zsm62b.png",
            },
            {
                id: 1,
                src:"https://res.cloudinary.com/djw0srhou/image/upload/q_auto:eco,f_auto,w_240,c_scale/v1776068858/Idea_-_Website-Success_w3do1p.png",
            },
            {
                id: 2,
                src:"https://res.cloudinary.com/djw0srhou/image/upload/q_auto:eco,f_auto,w_240,c_scale/v1776068881/Add_a_subheading_1_orsc3d.png",
            }
        ];

        let currentItemIndex = 0;
        const container = document.getElementById("sub-container");
        const prevBtn = document.getElementById("left");
        const nextBtn = document.getElementById('right');
        const image = document.getElementById('images');
        const video = document.getElementById('myVideo');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playPauseIcon = document.getElementById('playPauseIcon');
        const freezeBtn = document.getElementById('freezeBtn');
        const freezeIcon = document.getElementById('freezeIcon');
        const scanningEl = document.getElementById('scanning');

        // Video toggle
        function toggleVideo() {
            if (video.paused) {
                video.play();
                playPauseIcon.src = 'https://res.cloudinary.com/djw0srhou/image/upload/q_auto:good,f_auto,w_360,c_scale/v1776068844/pause_g780uy.png';
            } else {
                video.pause();
                playPauseIcon.src = 'https://res.cloudinary.com/djw0srhou/image/upload/q_auto:good,f_auto,w_360,c_scale/v1776068845/play_qxwwcx.png';
            }
        }

        // 🔧 FREEZE FUNCTION
        function freezeContent() {
            if (!cssObject || !cssAnchor) return;
            
            console.log("🔒 FREEZING NOW!");
            
            // Get world position properly
            const worldPosition = new THREE.Vector3();
            const worldQuaternion = new THREE.Quaternion();
            const worldScale = new THREE.Vector3();
            
            cssObject.getWorldPosition(worldPosition);
            cssObject.getWorldQuaternion(worldQuaternion);
            cssObject.getWorldScale(worldScale);
            
            // Save frozen state
            frozenPosition.copy(worldPosition);
            frozenQuaternion.copy(worldQuaternion);
            frozenScale.copy(worldScale);
            
            // Remove from anchor and add to scene
            cssAnchor.group.remove(cssObject);
            cssScene.add(cssObject);
            
            // Set position
            cssObject.position.copy(frozenPosition);
            cssObject.quaternion.copy(frozenQuaternion);
            cssObject.scale.copy(frozenScale);
            
            isFrozen = true;
            freezeBtn.style.background = "#4CAF50";
            freezeIcon.src = 'https://res.cloudinary.com/djw0srhou/image/upload/q_auto:eco,f_auto,w_240,c_scale/v1776499186/unlock_twp3et.png';
            
            // Keep content visible and scanning hidden
            container.style.visibility = "visible";
            freezeBtn.style.visibility = "visible";
            scanningEl.classList.add('hidden');
        }

        // 🔧 UNFREEZE FUNCTION
        function unfreezeContent() {
            if (!cssObject || !cssAnchor) return;
            
            console.log("🔓 UNFREEZING NOW!");
            
            // Remove from scene and add back to anchor
            cssScene.remove(cssObject);
            cssAnchor.group.add(cssObject);
            
            // Reset to local position
            cssObject.position.set(0, 0, 0);
            cssObject.quaternion.identity();
            cssObject.scale.set(1, 1, 1);    // Left column animations
    // gsap.from(".left-middle", {
    //     duration: 1,
    //     x: "-100%",
    //     ease: "power2.out"
    // });

    // gsap.from(".left-bottom", {
    //     duration: 1,
    //     y: "100%",
    //     ease: "power2.out"
    // });

    // gsap.from(".left-top", {
    //     duration: 1,
    //     y: "-100%",
    //     ease: "power2.out"
    // });             

    // // Middle column animations
    // gsap.from(".middle-top", {
    //     duration: 1,
    //     y: "100%",
    //     ease: "power2.out",
    //     opacity: 0,
    //     delay: 0.3
    // });

    // gsap.from(".middle-bottom", {
    //     duration: 1,
    //     y: "-100%",
    //     ease: "power2.out",
    //     opacity: 0,
    //     delay: 0.3
    // });

    // gsap.from(".middle-bottom2", {
    //     duration: 1,
    //     y: "-100%",
    //     ease: "power2.out",
    //     opacity: 0,
    //     delay: 0.5
    // });

    // gsap.from(".middle-middle", {
    //     duration: 0.6,
    //     scale: 0,
    //     opacity: 0,
    //     delay: 0.2,
    //     ease: "back.out(1.7)"
    // });

    // gsap.from(".sub-container", {
    //     duration: 0.5,
    //     scale: 0,
    //     opacity: 0,
    //     ease: "back.out(1.7)"
    // });

    // gsap.from(".button", {
    //     duration: 1,
    //     scale: 0,
    //     opacity: 0,
    //     delay: 0.8,
    //     ease: "back.out(1.7)"
    // });

    // gsap.from(".mid-bit-icon", {
    //     duration: 1,
    //     scale: 0,
    //     opacity: 0,
    //     delay: 0.8,
    //     ease: "back.out(1.7)"
    // });

    // // Right column animations
    // gsap.from(".right-top", {
    //     duration: 1.2,
    //     y: "100%",
    //     opacity: 0,
    //     ease: "power2.out",
    //     delay: 0.4
    // });

    // gsap.from(".right-middle", {
    //     duration: 1.1,
    //     x: "-100%",
    //     delay: 0.3,
    //     opacity: 0,
    //     ease: "power2.out"
    // });

    // gsap.from(".right-bottom", {
    //     duration: 1.2,
    //     y: "-100%",
    //     opacity: 0,
    //     delay: 0.4,
    //     ease: "power2.out"
    // });
            
            isFrozen = false;
            freezeBtn.style.background = "rgba(0, 0, 0, 0.7)";
            freezeIcon.src = 'https://res.cloudinary.com/djw0srhou/image/upload/q_auto:eco,f_auto,w_240,c_scale/v1776499186/padlock_vuzsyt.png';
            
            // 🔧 Check if target is currently visible
            if (!isTargetFound) {
                // Target not found - hide UI and show scanning
                container.style.visibility = "hidden";
                freezeBtn.style.visibility = "hidden";
                scanningEl.classList.remove('hidden');
            } else {
                // Target found - keep UI visible, hide scanning
                container.style.visibility = "visible";
                freezeBtn.style.visibility = "visible";
                scanningEl.classList.add('hidden');
            }
        }

        // 🔧 TOGGLE
        if (freezeBtn) {
            freezeBtn.addEventListener('click', function() {
                if (!isFrozen) {
                    freezeContent();
                } else {
                    unfreezeContent();
                }
            });
        }

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', toggleVideo);
        }

        if (video) {
            video.addEventListener('click', toggleVideo);
            video.addEventListener('ended', function() {
                playPauseIcon.src = 'https://res.cloudinary.com/djw0srhou/image/upload/v1776068845/play_qxwwcx.png';
            });
        }

        function updateDisplayedItem(index) {
            const item = imgItem[index];
            image.src = item.src;
        }

        prevBtn.addEventListener('click', function() {
            currentItemIndex = (currentItemIndex - 1 + imgItem.length) % imgItem.length;
            updateDisplayedItem(currentItemIndex);
        });

        nextBtn.addEventListener('click', function() {
            currentItemIndex = (currentItemIndex + 1) % imgItem.length;
            updateDisplayedItem(currentItemIndex);
        });

        cssObject = new CSS3DObject(container);
        cssAnchor = mindarThree.addCSSAnchor(0);
        cssAnchor.group.add(cssObject);
        
        // 🔧 Start with scanning visible, UI hidden
        scanningEl.classList.remove('hidden');
        container.style.visibility = "hidden";
        freezeBtn.style.visibility = "hidden";
        
        updateDisplayedItem(currentItemIndex);

        const anchor = mindarThree.addAnchor(0);
        
        // 🔧 Track target visibility
        let isTargetFound = false;

        anchor.onTargetFound = function() {
            isTargetFound = true;
            
            // Hide scanning
            scanningEl.classList.add('hidden');
            
            // Show UI if not frozen
            if (!isFrozen) {
                container.style.visibility = "visible";
                freezeBtn.style.visibility = "visible";
            } else {
                // If frozen, UI should already be visible
                container.style.visibility = "visible";
                freezeBtn.style.visibility = "visible";
            }

                // Left column animations
            // gsap.from(".left-middle", {
            //     duration: 1,
            //     x: "-100%",
            //     ease: "power2.out"
            // });

            // gsap.from(".left-bottom", {
            //     duration: 1,
            //     y: "100%",
            //     ease: "power2.out"
            // });

            // gsap.from(".left-top", {
            //     duration: 1,
            //     y: "-100%",
            //     ease: "power2.out"
            // });             

            // // Middle column animations
            // gsap.from(".middle-top", {
            //     duration: 1,
            //     y: "100%",
            //     ease: "power2.out",
            //     opacity: 0,
            //     delay: 0.6
            // });

            // gsap.from(".middle-bottom", {
            //     duration: 1,
            //     y: "-100%",
            //     ease: "power2.out",
            //     opacity: 0,
            //     delay: 0.6
            // });

            // gsap.from(".middle-bottom2", {
            //     duration: 1,
            //     y: "-100%",
            //     ease: "power2.out",
            //     opacity: 0,
            //     delay: 0.6
            // });

            // gsap.from(".middle-middle", {
            //     duration: 0.6,
            //     scale: 0,
            //     opacity: 0,
            //     delay: 0.5,
            //     ease: "back.out(1.7)"
            // });

            // gsap.from(".sub-container", {
            //     duration: 0.5,
            //     scale: 0,
            //     opacity: 0,
            //     ease: "back.out(1.7)"
            // });

            // gsap.from(".button", {
            //     duration: 1,
            //     scale: 0,
            //     opacity: 0,
            //     delay: 0.8,
            //     ease: "back.out(1.7)"
            // });

            // gsap.from(".mid-bit-icon", {
            //     duration: 1,
            //     scale: 0,
            //     opacity: 0,
            //     delay: 0.8,
            //     ease: "back.out(1.7)"
            // });

            // // Right column animations
            // gsap.from(".right-top", {
            //     duration: 1.2,
            //     y: "100%",
            //     opacity: 0,
            //     ease: "power2.out",
            //     delay: 0.6
            // });

            // gsap.from(".right-middle", {
            //     duration: 1.1,
            //     x: "-100%",
            //     delay: 0.3,
            //     opacity: 0,
            //     ease: "power2.out"
            // });

            // gsap.from(".right-bottom", {
            //     duration: 1.2,
            //     y: "-100%",
            //     opacity: 0,
            //     delay: 0.8,
            //     ease: "power2.out"
            // });
        }

        anchor.onTargetLost = function() {
            isTargetFound = false;
            
            // Only hide UI and show scanning if NOT frozen
            if (!isFrozen) {
                container.style.visibility = "hidden";
                freezeBtn.style.visibility = "hidden";
                scanningEl.classList.remove('hidden');
                
                if (video) {
                    video.pause();
                    playPauseIcon.src = 'https://res.cloudinary.com/djw0srhou/image/upload/q_auto:good,f_auto,w_360,c_scale/v1776068845/play_qxwwcx.png';
                }
            }
            // If frozen, UI stays visimport { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3/+esm";ible and scanning stays hidden
        }

        await mindarThree.start();

        // 🔧 RENDER LOOP - Force frozen position
        renderer.setAnimationLoop(function() {
            if (isFrozen && cssObject) {
                // Keep it frozen exactly where it was
                cssObject.position.copy(frozenPosition);
                cssObject.quaternion.copy(frozenQuaternion);
                cssObject.scale.copy(frozenScale);
            }
            
            cssRenderer.render(cssScene, camera);
            renderer.render(scene, camera);
        });
    };

    start();
});