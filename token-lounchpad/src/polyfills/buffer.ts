// src/buffer.ts

import { Buffer } from "buffer";
import process from "process";

// Inject polyfills globally for browser
(window as any).Buffer = Buffer;
(window as any).process = process;
