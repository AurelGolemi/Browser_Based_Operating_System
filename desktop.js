let gridItems = document.querySelectorAll('.grid-os');

gridItems.forEach(item => {
  item.addEventListener('click', () => {
    // alert(`You clicked on ${item.textContent.trim()}`);
  })
})

gridItems.forEach(item => {
  item.addEventListener('dblclick', () => {
    const thisPc = document.getElementById('this-pc');
    if (item === thisPc) {
      window.openApp('/App/this-pc.js', '_blank', 'width=800, height=600');
      return;
    }

    const notes = window.open('', '_blank', 'width=400,height=300').document.write(`
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notes</title>
        </head>
        <body>
            <textarea id="notes-textarea" placeholder="Enter your notes here..." style="width: 100%; height: 100%;"></textarea>
        </body>
        </html>`
    );
    if (notes) {
      item.setAttribute('data-notes', notes);
    };
  });
});