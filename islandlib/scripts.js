
$(document).ready(function(){
    $('.slider').slick({
        dots: true,
        speed: 400,
        slidesToShow: 4,
        slidesToScroll: 1,
        variableWidth: true,
        infinite: false,
        arrows: false,
        respondTo: 'slider',
        responsive: [
    {
       breakpoint: 1040,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      } 
    },
    {
      breakpoint: 850,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
       breakpoint: 450,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      } 
    }
  ]
    });
});


function openModal(id) {
            // Add is-active class on the modal
            document.getElementById("modal"+id)
                .classList.add("is-active");
        }

document.querySelectorAll(
'.modal-background, .modal-close,.modal-card-head .delete, .modal-card-foot .button'
                  ).forEach(($el) => {
            const $modal = $el.closest('.modal');
 
            $el.addEventListener('click', () => {
                // Remove the is-active class from the modal
                $modal.classList.remove("is-active");
            });
        });
