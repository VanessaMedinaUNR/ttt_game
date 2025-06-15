document.getElementById("startbtn").addEventListener("click", function ( ) {
    this.textContent = "Clear";
    clearTable();
    
});


function clearTable () {
    const cells = document.querySelectorAll(".table_content");

    cells.forEach(cell => {
        cell.value = "";
    });
}


function compMoves () {
    
}


