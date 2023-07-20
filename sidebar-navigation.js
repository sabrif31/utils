class SideBar {
  constructor(list, anime) {
    this.list = list;
    this.anime = anime;
    this.sidebar = `<div class='sidebar-container'>
    <div id="btn-container-bookmark">
      <div id="btn-bookmark">
        <div id='top'></div>
        <div id='middle'></div>
        <div id='bottom'></div>
      </div>
    </div>
    <div id="box-bookmark">
        <div id="items-bookmark">
        </div>
    </div>
  </div>`;

    document.body.insertAdjacentHTML( 'beforeend', this.sidebar );

      const sidebarBtn = document.querySelector('#btn-bookmark');
      const sidebarBox = document.querySelector('#box-bookmark');
      const sidebarContainer = document.querySelector('.sidebar-container');
      sidebarBtn.addEventListener('click', event => {
          sidebarBtn.classList.toggle('active');
          sidebarBox.classList.toggle('active');
          sidebarContainer.classList.toggle('active');
          /*
          .add({
              targets: '.ml12 .letter',
              translateX: [0,-30],
              opacity: [1,0],
              easing: "easeInExpo",
              duration: 500,
              delay: (el, i) => 100 + 30 * i
          })
          */
          /*
          let elements = []
          for (var i = 0; i < this.list.length; i++) {
              elements.push('.items-bookmark .item-bookmark-anime-' + i + ' a')
          }
          */
          if (sidebarBtn.classList.contains('active')) {
              // Animate link title
              const textWrapper = document.querySelectorAll('#items-bookmark .item-bookmark a');
              textWrapper.forEach(item => {
                  item.innerHTML = item.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
              })
              var elements = document.querySelectorAll('#items-bookmark .item-bookmark a .letter');
              this.anime.timeline({ loop: false, duration: 500 }).add({
                  targets: elements,
                  translateX: [40,0],
                  translateZ: 0,
                  opacity: [0,1],
                  easing: "easeOutExpo",
                  duration: 500,
                  delay: (el, i) => 5 * i // 200 + 30
              });
          }
      });

      /*
      document.body.addEventListener('click', event => {
        if (sidebarBox.classList.contains('active')) {
          sidebarBtn.classList.remove('active');
          sidebarBox.classList.remove('active');item-bookmark item-bookmark-anime-1
        }
      });
      */
    this.addButtonToDOM = this.addButtonToDOM.bind(this);
  }

  addButtonToDOM() {
      const itemsNode = document.querySelector('#items-bookmark');
      for (var i = 0; i < this.list.length; i++) {
          const divElt = document.createElement('div');

          const img = document.createElement('img');
          img.altText = "Thumbnail Video"
          img.src =this.list?.[i]?.thumbnail;
          img.width = 250
          divElt.append(img);

          const itemNode = document.createElement('div');
          itemNode.classList.add('item-bookmark');
          itemNode.classList.add('item-bookmark-anime-' + i);
          itemNode.innerHTML = `<a class="ml12" href="https://www.youtube.com/watch?v=${this.list[i].id}">${this.list[i].title}</a>`;
          divElt.append(itemNode);
          itemsNode.append(divElt);
      }

  }

}
