class NavHeaderYTBookmark {
        constructor(list) {
		this.list = list
    		this.addButtonToDOM = this.addButtonToDOM.bind(this);
        }
	
        addButtonToDOM() {
		const menuDiv = document.createElement('div');
		menuDiv.classList.add('menu-nav-header');
		const containerDiv = document.createElement('div');
		containerDiv.classList.add('container-nav-header');
		const toggleDiv = document.createElement('div');
		toggleDiv.classList.add('toggle-nav-header');
		containerDiv.append(toggleDiv);
		menuDiv.append(containerDiv);
	
		for (var i = 0; i < this.list.length; i++) {
			const spanHidden = document.createElement('span');
			spanHidden.classList.add('hidden-nav-header');
			spanHidden.classList.add('span-nav-header');
			spanHidden.innerHTML = this.list[i]
			menuDiv.append(spanHidden);
		}
	
		const body = document.querySelector('body');
		body.append(menuDiv);
		
		const eltToggle = document.querySelector('.toggle-nav-header');
		eltToggle.addEventListener('click', function() {
			const eltMenu = document.querySelector('.menu-nav-header');
			const eltSpanAll = document.querySelectorAll('.span-nav-header');
			const eltContainer = document.querySelector('.container-nav-header');
			eltMenu.classList.toggle('expanded-nav-header');
			for (var i = 0; i < eltSpanAll.length; i++) {
				eltSpanAll[i].classList.toggle('hidden-nav-header');
			}
			eltContainer.classList.toggle('close-nav-header');
			eltToggle.classList.toggle('close-nav-header');
		})
        }
}
