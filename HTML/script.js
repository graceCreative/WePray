// Initialize a new Lenis instance for smooth scrolling
const lenis = new Lenis();

// Listen for the 'scroll' event and log the event data to the console

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on('scroll', ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);







function anim() {
    var tl = gsap.timeline();
  
    tl.from(".nav", {
      y: "-10",
      opacity: 0,
      duration: 2,
      ease: Expo.easeInOut,
    })
      .from(".anim", {
        y: "200",
        duration: 2,
        ease: Expo.easeInOut,
        delay: -1,
        stagger: 0.2,
      })
      .from(".leftAnim", {
        x: "700",
        duration: 2,
        ease: Expo.easeInOut,
        delay: -1,
        stagger: 0.2,
      });
  }
  anim();





gsap.utils.toArray(".animText1").forEach((elem) => {
  gsap.from(elem, {
    y: 100,
    duration: 2,
    ease: Expo.easeInOut,
    scrollTrigger: {
      trigger: elem, // each element is its own trigger
      start: "top 80%",
      end: "top 60%",
      scrub: true, // set to true if you want to see the markers
    },
  });
});




const paragraph = document.getElementById('paragraph');
  const words = paragraph.innerText.split(' ');

  // Clear the original paragraph text and add words wrapped in span tags
  paragraph.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');

  // Select all the newly created span elements and animate them
  gsap.from("#paragraph span", {
    duration: 1,
    color: "grey",
    y: 50,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger : {
      trigger: "#paragraph",
      start: "top 80%",
      end: "top 60%",
      scrub: true,

    }
  });






  const swiper = new Swiper(".swiper", {
    // Optional parameters
    loop: true,
  
    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  
    // Navigation arrows
    navigation: {
      nextEl: ".next",
      prevEl: ".prev",
    },
  });