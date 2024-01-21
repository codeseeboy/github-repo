 
   function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

const repobtn = document.getElementById('fr');
repobtn.addEventListener('click' , ()=>{
    document.getElementById('uh').style.display = "block";
    document.getElementById('container').style.display = "none";
    document.getElementById('pan').style.display = "block";
})
function goToPage(pageNumber) {
    currentPage = pageNumber;
    displayRepositories(currentPage);
}
function generatePageNumbers(currentPage, totalPages, visiblePages = 9) {
    const halfVisiblePages = Math.floor(visiblePages / 2);
    const startPage = Math.max(currentPage - halfVisiblePages, 1);
    const endPage = Math.min(startPage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return pageNumbers;
}
