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
      y: 400,
      duration: 2,
      ease: Expo.easeInOut,
      delay: -1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: elem, // each element is its own trigger
        start: "top 80%",
        end: "top 60%",
        markers: false, // set to true if you want to see the markers
      },
    });
  });
  
  