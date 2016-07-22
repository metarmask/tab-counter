const storage = new Proxy(localStorage, {
	get: (target, property) => {
		if(localStorage.getItem(property) === null){
			return;
		}
		let parseResult;
		try {
			parseResult = JSON.parse(target.getItem(property));
		}catch(error){
			if(!(error instanceof SyntaxError)){
				throw error;
			}
		}
		return parseResult;
	},
	set: (target, property, value) => {
		const stringified = JSON.stringify(value);
		if(stringified === undefined){
			return false;
		}
		target.setItem(property, stringified);
		return true;
	}
});