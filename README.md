<p align="center">
  <a href="https://github.com/node-ffi-packager"><img src="https://raw.githubusercontent.com/node-ffi-packager/resources/master/logotype/node-ffi-packager.svg?sanitize=true" alt="node-ffi-packager logotype, impossible cubes in green" width="256" border="0" /></a>
</p>

# [Forked version of `node-ffi-generate`](https://github.com/node-ffi-packager/node-ffi-generate)

- Used by [node-ffi-packager](https://github.com/node-ffi-packager) to generate [node-ffi-libraries](https://github.com/node-ffi-libraries).
- Depends on a similarly forked [node-libclang](https://github.com/node-ffi-packager/node-libclang).
- Use this version by [referencing the repository/branch in `package.json`](https://docs.npmjs.com/configuring-npm/package-json.html#github-urls) instead of the [official version published on npm](https://www.npmjs.com/package/ffi-generate).
- Based on [`node-ffi-generate`](https://github.com/tjfontaine/node-ffi-generate) ([5ad34dc](https://github.com/tjfontaine/node-ffi-generate/commit/5ad34dc69befbd59601c507c90571b1662e0e66d), [v0.0.8](https://github.com/tjfontaine/node-ffi-generate/releases/tag/v0.0.8)) by [Timothy J Fontaine](https://github.com/tjfontaine).

---



node-libclang
=============
Generate FFI Bindings from header file

Installation
------------

For command line usage.

```shell
# NOTE: global installation is not necessary, but convenient for command line usage.
npm install --global github:node-ffi-packager/node-ffi-generate#v1
```

For programmatic usage.

```shell
npm install --save github:node-ffi-packager/node-ffi-generate#v1
```

Generate FFI Bindings
---------------------
`ffi-generate -f /path/to/myLibrary/header.h -l libmyLibrary`

Will parse the given filename and print to standard out the resulting javascript
suitable for use as a module.

 * f -- required -- The header file you wish to parse
 * l -- required -- The library FFI will use to dlopen
 * m -- optional -- The module name underwhich functions will be stored (uses library name otherwise)
 * p -- optional -- Only include functions whose name starts with the provided prefix
  - you can specify multiple `-p` on the command line to get multiple prefixes
 * x -- optional -- Restrict to only functions declared in the given header file
 * s -- optional -- Use StrictType type wrapper (experimental)
 * L -- optional -- If libclang.{so,dylib} is in a non-standard path use this
which will rerun the process with `[DY]LD_LIBRARY_PATH` set

It may be necessary to pass additional flags to libclang so it can better parse
the header (i.e. include paths). To pass options directly to libclang use `--`
so ffi-generate-node knows to stop parsing arguments, the rest will be passed
to libclang without modification.

`ffi-generate -f /usr/include/ImageMagick/wand/MagickWand.h -l libMagickWand -m wand -p Magick -- $(Magick-config --cflags)`

Generate FFI Bindings Programatically
-------------------------------------
```javascript
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var jsb = require('beautifyjs');
var generate = require('lib/generateffi').generate;

exec('llvm-config --includedir', function (fail, out, err) {
  var includedir = out.replace(/\s+$/, '');
  var result = exports.generate({
    filename: path.join(includedir, 'clang-c', 'Index.h'),
    library: 'libclang',
    prefix: 'clang_', 
    includes: [includedir],
  });

  if (result.unmapped.length > 0) {
    console.log('----- UNMAPPED FUNCTIONS -----');
    console.log(result.unmapped);
    console.log('----- UNMAPPED FUNCTIONS -----');
  }

  fs.writeFileSync(path.join(__dirname, 'dynamic_clang.js'), jsb.js_beautify(result.serialized));
  var dynamic_clang = require(path.join(__dirname, 'dynamic_clang'));
  var ver = dynamic_clang.libclang.clang_getClangVersion();
  console.log(dynamic_clang.libclang.clang_getCString(ver));
  dynamic_clang.libclang.clang_disposeString(ver)
});
````
Input to the generate method

 * opts.filename -- required -- the full path to the header source file to parse 
 * opts.library -- required -- the library ffi should use to dlopen
 * opts.module -- optional -- the name of the module that will be exported (otherwise uses library name)
 * opts.prefix -- optional --  restrict imported functions to a given prefix
 * opts.includes -- optional -- a set of directory paths to aid type expansion
 * opts.compiler_args -- optional -- a set of clang command line options passed to the parser
 * opts.single_file -- optional -- restricts functions to only those defined in the header file
   - this does not restrict dependent types

The result from generate is an object that has two properties

 * serialized - a string representation of the bindings suitable for writing to file
 * unmapped - a set of functions that failed to map -- most likely from failure to
map a type to ffi type.
  - each element is an object with following properties
   * position - -1 means the return type, otherwise the argument
   * arg - name of the type that failed to map
   * name - the name of the function that failed
   * decl - the signature of the function that failed

---

`node-ffi-generate` Copyright &copy; 2011, 2012, 2013, 2014 [Timothy J Fontaine](https://github.com/tjfontaine), 2020 [Joel Purra](https://joelpurra.com/). Released under [MIT License](https://opensource.org/licenses/MIT).
