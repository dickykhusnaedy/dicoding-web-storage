(() => {
	const localStorageKey = 'BOOK_KEY'

	if (typeof (Storage) !== 'undefined') {
		let dataBooks = []

		function getData(ev) {
			ev.preventDefault()
			
			const title = document.querySelector("#inputBookTitle"),
			author = document.querySelector("#inputBookAuthor"),
			year   = document.querySelector("#inputBookYear"),
				comp = document.querySelector("#inputBookIsComplete"),
				data = {
					id: +new Date,
					title: title.value,
					author: author.value,
					year: year.value,
					isComplete: comp.checked
				}
			dataBooks.push(data)
			document.dispatchEvent(new Event("bookUpdate"))
			window.location.reload()
		}

		function unRead(id) {
			const getId = Number(id.target.id),
				findData = dataBooks.findIndex(book => {
					return book.id === getId
				})
			if (confirm('Yakin mau memindahkannya ke Rak belum selesai dibaca?')) {
				dataBooks[findData] = {
				...dataBooks[findData],
					isComplete: false
				}, document.dispatchEvent(new Event("bookUpdate"))
				window.location.reload()
			} else {
				alert('Tidak jadi dipindahkan')
			}
		}
		
		function readBook(id) {
			const getId = Number(id.target.id),
			findData = dataBooks.findIndex(book => {
				return book.id === getId
			})
			if (confirm('Yakin mau memindahkannya ke Rak selesai dibaca?')) {
				dataBooks[findData] = {
					...dataBooks[findData],
					isComplete: true
				}, document.dispatchEvent(new Event("bookUpdate"))
				window.location.reload()
			} else {
				alert('Tidak jadi dipindahkan')
			}
		}
			
		function deleteData(id) {
			const getId = Number(id.target.id),
			findData = dataBooks.findIndex(book => {
				return book.id === getId
			})
			if (confirm('Yakin mau dihapus bukunya?') == true) {
				dataBooks.splice(findData, 1)
				document.dispatchEvent(new Event("bookUpdate"))
				window.location.reload()
			} else {
				alert('Yeayy, bukunya tidak jadi dihapus...')
			}
		}

		function searchData(ev) {
			ev.preventDefault()

			const search = document.querySelector("#searchBookTitle")
			let query = search.value
			showData(dataBooks.filter(search => {
				return search.title.toLowerCase().includes(query.toLowerCase())
			}))
		}
		
		function resetFormFunc() {
			showData(dataBooks.filter(function () { return true }))
			document.dispatchEvent(new Event("bookUpdate"))
		}

		function resetBookFunc() {
			localStorage.removeItem(localStorageKey)
			window.location.reload()
		}

		function showData(data) {
			const inCompleteSection = document.querySelector("#incompleteBookshelfList"),
				completeSection = document.querySelector("#completeBookshelfList")
			
			inCompleteSection.innerHTML = "", completeSection.innerHTML = ""

			for (const book of data) {
				// create element
				const elementArticle = document.createElement("article")
				elementArticle.classList.add("book_item")
				const elementH3 = document.createElement("h3")
				elementH3.innerText = book.title;
				const elementAuthor = document.createElement("p")
				elementAuthor.innerText = "Penulis: " + book.author
				const elementYear = document.createElement("span")
				elementYear.innerText = "Tahun: " + book.year
				
				if (book.isComplete) { // book status selesai dibaca
					// show element
					completeSection.append(elementArticle), elementArticle.appendChild(elementH3), elementArticle.appendChild(elementAuthor), elementArticle.appendChild(elementYear)

					const actionWrapper = document.createElement("div") // action wrapper
					actionWrapper.classList.add('action')
					const btnStatus = document.createElement('button') // button status wrapper
					btnStatus.id = book.id, btnStatus.innerText = 'Selesai dibaca', btnStatus.classList.add('green'), btnStatus.addEventListener('click', unRead)				
					const btnDelete = document.createElement('button') // button delete wrapper
					btnDelete.id = book.id, btnDelete.innerText = 'Hapus data', btnDelete.classList.add('red'), btnDelete.addEventListener('click', deleteData)

					// show element
					actionWrapper.appendChild(btnStatus), actionWrapper.appendChild(btnDelete), elementArticle.appendChild(actionWrapper), completeSection.append(elementArticle)
				} else { // book status belum dibaca
					// show element
					inCompleteSection.append(elementArticle), elementArticle.appendChild(elementH3), elementArticle.appendChild(elementAuthor), elementArticle.appendChild(elementYear)

					const actionWrapper = document.createElement("div") // action wrapper
					actionWrapper.classList.add('action')
					const btnStatus = document.createElement('button') // button status wrapper
					btnStatus.id = book.id, btnStatus.innerText = 'Belum selesai dibaca', btnStatus.classList.add('green'), btnStatus.addEventListener('click', readBook)				
					const btnDelete = document.createElement('button') // button delete wrapper
					btnDelete.id = book.id, btnDelete.innerText = 'Hapus data', btnDelete.classList.add('red'), btnDelete.addEventListener('click', deleteData)

					// show element
					actionWrapper.appendChild(btnStatus), actionWrapper.appendChild(btnDelete), elementArticle.appendChild(actionWrapper), inCompleteSection.append(elementArticle)
				}
			}
		}

		function saveToLocal() {
			localStorage.setItem(localStorageKey, JSON.stringify(dataBooks))
		}
		// load page
		window.addEventListener('load', (function () {
			dataBooks = JSON.parse(localStorage.getItem(localStorageKey)) || []
			showData(dataBooks)
			
			// input form submit data
			const inputForm = document.querySelector("#inputBook")
			const searchForm = document.querySelector("#searchBook")
			const resetForm = document.querySelector("#reset")
			const resetBook = document.querySelector("#resetBook")

			// event listener
			inputForm.addEventListener("submit", getData)
			searchForm.addEventListener("submit", searchData)
			resetForm.addEventListener("click", resetFormFunc)
			resetBook.addEventListener("click", resetBookFunc)
			document.addEventListener("bookUpdate", saveToLocal)
		}))
	} else {
		alert('Your browser not supported Web Storage')
	}
})()