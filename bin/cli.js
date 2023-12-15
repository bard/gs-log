#!/usr/bin/env node

import("../dist/index.js").then(({ run }) => run()).catch(console.err);
