// Copyright 2011, 2012, 2013, 2014 Timothy J Fontaine <tjfontaine@gmail.com>
// Copyright 2020 Joel Purra <https://joelpurra.com/>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE

const {
	join,
} = require("path");
const {
	readFileSync,
} = require("fs");
const hogan = require("hogan.js");

const loadTemplates = () => {
	const templateDir = join(__dirname, "..", "templates", "ffi");
	const loadTemplate = (filename) => hogan.compile(readFileSync(join(templateDir, filename), "utf8"));

	const templates = {
		ArrayTmpl: loadTemplate("array.mustache"),
		FuncPtrTmpl: loadTemplate("funcptr.mustache"),
		OpaqueTmpl: loadTemplate("opaque.mustache"),
		StructTmpl: loadTemplate("struct.mustache"),
		TypeTmpl: loadTemplate("ffi.mustache"),
		UnionTmpl: loadTemplate("union.mustache"),
	};

	return templates;
};

module.exports = loadTemplates;