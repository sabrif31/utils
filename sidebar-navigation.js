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

    this.addButtonToDOM = this.addButtonToDOM.bind(this);
    this.init = this.init.bind(this);
    this.init()
  }

  init() {
    document.body.insertAdjacentHTML( 'beforeend', this.sidebar );
    const sidebarBtn = document.querySelector('#btn');
    sidebarBtn.addEventListener('click', event => {
      sidebarBtn.classList.toggle('active');
      sidebarBox.classList.toggle('active');
    });
    
    document.body.addEventListener('click', event => {
      if (sidebarBox.classList.contains('active')) {
        sidebarBtn.classList.remove('active');
        sidebarBox.classList.remove('active');
      }
    });
  }

  addButtonToDOM() {
    const itemsNode = document.querySelector('#page-wrapper');
		for (var i = 0; i < this.list.length; i++) {
			const itemNode = document.createElement('div');
			itemNode.classList.add('item-bookmark');
			itemNode.innerHTML = this.list[i];
			itemsNode.append(itemNode);
		}
    
  }

}
