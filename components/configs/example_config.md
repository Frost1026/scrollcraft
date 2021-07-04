#Config setup

##File creation requirement
You just have to follow these steps, the rest will be handled programmatically:

1. Create your wanted file that ends with .json
2. Make sure your filename and path matches the one declared in said program
3. Make sure the program have a function and variables that look like this: 
``` js 
//Template for empty json file
const template = {
	table: []
}

// JSON Buffer
let options = {} //change to variable names you intend to use

// Functions to get declared, write here
const refreshJSONBuffer = (filepath, obj) => {
	try {
		const data = fs.readFileSync(filepath)
		const temp = JSON.parse(data)
		const keys = Object.keys(temp)

		keys.some((value) => {
			obj[value] = temp[value]
		})
	} catch {
		console.log(`Can't read ${filepath}`)
		console.log(`Writing template to ${filepath}`)
		fs.writeFileSync(filepath, JSON.stringify(template, null, 2))
		refreshJSONBuffer(filepath, obj)
	}

	Object.freeze(obj)
}
```
4. The rest will be handled programmatically