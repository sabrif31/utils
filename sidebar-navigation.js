class SideBar {
  constructor(list) {
    this.list = list;
    this.sidebar = `<div id="btn-bookmark">
		<div id='top'></div>
		<div id='middle'></div>
		<div id='bottom'></div>
</div>
<div id="box-bookmark">
		<div id="items-bookmark">
		</div>
</div>`;

    document.body.insertAdjacentHTML( 'beforeend', this.sidebar );

      const sidebarBtn = document.querySelector('#btn-bookmark');
      const sidebarBox = document.querySelector('#box-bookmark');
      sidebarBtn.addEventListener('click', event => {
        sidebarBtn.classList.toggle('active');
        sidebarBox.classList.toggle('active');
      });

      /*
      document.body.addEventListener('click', event => {
        if (sidebarBox.classList.contains('active')) {
          sidebarBtn.classList.remove('active');
          sidebarBox.classList.remove('active');
        }
      });
      */
    
    this.addButtonToDOM = this.addButtonToDOM.bind(this);
  }

  addButtonToDOM() {
    const itemsNode = document.querySelector('#items-bookmark');
		for (var i = 0; i < this.list.length; i++) {
			const itemNode = document.createElement('div');
			itemNode.classList.add('item-bookmark');
			itemNode.innerHTML = `<a href="https://www.youtube.com/watch?v=${this.list[i]}">${this.list[i]}</a>`;
			itemsNode.append(itemNode);
		}
    
  }

}
module.exports = SideBar;
