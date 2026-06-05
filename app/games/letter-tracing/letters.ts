export type TraceLetter = {
  key: string;
  label: string;
  speak: string;
  paths: string[];
  /** Độ dày riêng cho từng nét. Thân chữ dùng 16, dấu và thanh ngang dùng 9-12. */
  strokeWidths?: number[];
  /** Vị trí hiển thị số thứ tự nét. */
  numberPositions?: { x: number; y: number }[];
};

// Hệ tọa độ SVG 600x520.
// Bộ này được chuẩn hóa theo hướng: chữ 1 nét mảnh, tách từng nét, có thứ tự viết,
// số nét và mũi tên hướng dẫn. Dấu tiếng Việt được viết sau phần thân chữ.
export const TRACE_LETTERS: TraceLetter[] = [
  {
    key: "A",
    label: "A",
    speak: "chữ A",
    paths: [
      "M200 420 L300 100",
      "M300 100 L400 420",
      "M245 280 L355 280",
    ],
    strokeWidths: [16, 16, 12],
    numberPositions: [
      { x: 176, y: 424 },
      { x: 316, y: 104 },
      { x: 235, y: 260 },
    ],
  },
  {
    key: "Ă",
    label: "Ă",
    speak: "chữ Ă",
    paths: [
      "M200 420 L300 100",
      "M300 100 L400 420",
      "M245 280 L355 280",
      "M254 52 C278 78 322 78 346 52",
    ],
    strokeWidths: [16, 16, 12, 9],
    numberPositions: [
      { x: 176, y: 424 },
      { x: 316, y: 104 },
      { x: 235, y: 260 },
      { x: 248, y: 30 },
    ],
  },
  {
    key: "Â",
    label: "Â",
    speak: "chữ Â",
    paths: [
      "M200 420 L300 100",
      "M300 100 L400 420",
      "M245 280 L355 280",
      "M254 70 L300 38",
      "M300 38 L346 70",
    ],
    strokeWidths: [16, 16, 12, 9, 9],
    numberPositions: [
      { x: 176, y: 424 },
      { x: 316, y: 104 },
      { x: 235, y: 260 },
      { x: 238, y: 50 },
      { x: 354, y: 50 },
    ],
  },
  {
    key: "B",
    label: "B",
    speak: "chữ B",
    paths: [
      "M220 100 L220 420",
      "M220 100 L360 100 C404 100 426 132 426 174 C426 216 402 246 360 246 L220 246",
      "M220 246 L374 246 C420 246 440 280 438 326 C436 380 408 420 366 420 L220 420",
    ],
    strokeWidths: [16, 16, 16],
    numberPositions: [
      { x: 196, y: 116 },
      { x: 236, y: 80 },
      { x: 238, y: 226 },
    ],
  },
  {
    key: "C",
    label: "C",
    speak: "chữ C",
    paths: [
      "M424 142 C386 100 310 88 248 106 C176 128 138 188 138 260 C138 332 176 392 248 414 C310 432 386 420 424 378",
    ],
    strokeWidths: [16],
    numberPositions: [
      { x: 424, y: 118 },
    ],
  },
  {
    key: "D",
    label: "D",
    speak: "chữ D",
    paths: [
      "M220 100 L220 420",
      "M220 100 L342 100 C410 100 450 158 450 260 C450 362 410 420 342 420 L220 420",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 196, y: 116 },
      { x: 238, y: 80 },
    ],
  },
  {
    key: "Đ",
    label: "Đ",
    speak: "chữ Đ",
    paths: [
      "M220 100 L220 420",
      "M220 100 L342 100 C410 100 450 158 450 260 C450 362 410 420 342 420 L220 420",
      "M156 260 L360 260",
    ],
    strokeWidths: [16, 16, 12],
    numberPositions: [
      { x: 196, y: 116 },
      { x: 238, y: 80 },
      { x: 142, y: 242 },
    ],
  },
  {
    key: "E",
    label: "E",
    speak: "chữ E",
    paths: [
      "M420 100 L220 100 L220 420 L420 420",
      "M220 260 L392 260",
    ],
    strokeWidths: [16, 12],
    numberPositions: [
      { x: 430, y: 84 },
      { x: 205, y: 242 },
    ],
  },
  {
    key: "Ê",
    label: "Ê",
    speak: "chữ Ê",
    paths: [
      "M420 100 L220 100 L220 420 L420 420",
      "M220 260 L392 260",
      "M258 66 L300 38",
      "M300 38 L342 66",
    ],
    strokeWidths: [16, 12, 9, 9],
    numberPositions: [
      { x: 430, y: 84 },
      { x: 205, y: 242 },
      { x: 244, y: 48 },
      { x: 350, y: 48 },
    ],
  },
  {
    key: "G",
    label: "G",
    speak: "chữ G",
    paths: [
      "M424 142 C386 100 310 88 248 106 C176 128 138 188 138 260 C138 332 176 392 248 414 C310 432 386 420 424 378",
      "M424 378 L424 278 L280 278",
    ],
    strokeWidths: [16, 14],
    numberPositions: [
      { x: 424, y: 118 },
      { x: 444, y: 380 },
    ],
  },
  {
    key: "H",
    label: "H",
    speak: "chữ H",
    paths: [
      "M220 100 L220 420",
      "M220 260 L400 260",
      "M400 100 L400 420",
    ],
    strokeWidths: [16, 12, 16],
    numberPositions: [
      { x: 196, y: 116 },
      { x: 206, y: 242 },
      { x: 416, y: 116 },
    ],
  },
  {
    key: "I",
    label: "I",
    speak: "chữ I",
    paths: [
      "M220 100 L380 100",
      "M300 100 L300 420",
      "M220 420 L380 420",
    ],
    strokeWidths: [12, 16, 12],
    numberPositions: [
      { x: 208, y: 82 },
      { x: 276, y: 116 },
      { x: 208, y: 402 },
    ],
  },
  {
    key: "K",
    label: "K",
    speak: "chữ K",
    paths: [
      "M220 100 L220 420",
      "M420 100 L220 260",
      "M220 260 L420 420",
    ],
    strokeWidths: [16, 16, 16],
    numberPositions: [
      { x: 196, y: 116 },
      { x: 430, y: 84 },
      { x: 206, y: 280 },
    ],
  },
  {
    key: "L",
    label: "L",
    speak: "chữ L",
    paths: [
      "M220 100 L220 420 L420 420",
    ],
    strokeWidths: [16],
    numberPositions: [
      { x: 196, y: 116 },
    ],
  },
  {
    key: "M",
    label: "M",
    speak: "chữ M",
    paths: [
      "M180 420 L180 120",
      "M180 120 L300 224",
      "M300 224 L420 120",
      "M420 120 L420 420",
    ],
    strokeWidths: [16, 16, 16, 16],
    numberPositions: [
      { x: 156, y: 420 },
      { x: 192, y: 104 },
      { x: 314, y: 206 },
      { x: 436, y: 120 },
    ],
  },
  {
    key: "N",
    label: "N",
    speak: "chữ N",
    paths: [
      "M200 420 L200 120",
      "M200 120 L400 420",
      "M400 420 L400 120",
    ],
    strokeWidths: [16, 16, 16],
    numberPositions: [
      { x: 176, y: 420 },
      { x: 214, y: 104 },
      { x: 416, y: 420 },
    ],
  },
  {
    key: "O",
    label: "O",
    speak: "chữ O",
    paths: [
      "M300 118 C218 118 150 178 150 260 C150 342 218 422 300 422 C382 422 450 342 450 260 C450 178 382 118 300 118 Z",
    ],
    strokeWidths: [16],
    numberPositions: [
      { x: 292, y: 94 },
    ],
  },
  {
    key: "Ô",
    label: "Ô",
    speak: "chữ Ô",
    paths: [
      "M300 118 C218 118 150 178 150 260 C150 342 218 422 300 422 C382 422 450 342 450 260 C450 178 382 118 300 118 Z",
      "M252 76 L300 42",
      "M300 42 L348 76",
    ],
    strokeWidths: [16, 9, 9],
    numberPositions: [
      { x: 292, y: 94 },
      { x: 238, y: 58 },
      { x: 356, y: 58 },
    ],
  },
  {
    key: "Ơ",
    label: "Ơ",
    speak: "chữ Ơ",
    paths: [
      "M300 118 C218 118 150 178 150 260 C150 342 218 422 300 422 C382 422 450 342 450 260 C450 178 382 118 300 118 Z",
      "M420 112 C446 78 488 84 494 120 C500 154 468 188 422 176",
    ],
    strokeWidths: [16, 9],
    numberPositions: [
      { x: 292, y: 94 },
      { x: 418, y: 88 },
    ],
  },
  {
    key: "P",
    label: "P",
    speak: "chữ P",
    paths: [
      "M220 100 L220 420",
      "M220 100 L380 100 C422 100 438 138 438 182 C438 230 412 262 372 262 L220 262",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 196, y: 116 },
      { x: 236, y: 80 },
    ],
  },
  {
    key: "Q",
    label: "Q",
    speak: "chữ Q",
    paths: [
      "M300 118 C218 118 150 178 150 260 C150 342 218 422 300 422 C382 422 450 342 450 260 C450 178 382 118 300 118 Z",
      "M358 360 L426 452",
    ],
    strokeWidths: [16, 12],
    numberPositions: [
      { x: 292, y: 94 },
      { x: 344, y: 342 },
    ],
  },
  {
    key: "R",
    label: "R",
    speak: "chữ R",
    paths: [
      "M220 100 L220 420",
      "M220 100 L380 100 C422 100 438 138 438 182 C438 230 412 262 372 262 L220 262",
      "M370 262 L430 420",
    ],
    strokeWidths: [16, 16, 16],
    numberPositions: [
      { x: 196, y: 116 },
      { x: 236, y: 80 },
      { x: 386, y: 250 },
    ],
  },
  {
    key: "S",
    label: "S",
    speak: "chữ S",
    paths: [
      "M420 144 C398 104 322 86 262 104 C206 120 178 154 194 196 C210 238 276 254 338 278 C398 302 424 334 404 376 C382 420 306 436 238 414 C172 392 144 350 164 306",
    ],
    strokeWidths: [16],
    numberPositions: [
      { x: 420, y: 120 },
    ],
  },
  {
    key: "T",
    label: "T",
    speak: "chữ T",
    paths: [
      "M180 100 L420 100",
      "M300 100 L300 420",
    ],
    strokeWidths: [12, 16],
    numberPositions: [
      { x: 168, y: 82 },
      { x: 276, y: 116 },
    ],
  },
  {
    key: "U",
    label: "U",
    speak: "chữ U",
    paths: [
      "M180 100 L180 336 C180 398 226 432 300 432 C374 432 420 398 420 336 L420 100",
    ],
    strokeWidths: [16],
    numberPositions: [
      { x: 156, y: 116 },
    ],
  },
  {
    key: "Ư",
    label: "Ư",
    speak: "chữ Ư",
    paths: [
      "M180 100 L180 336 C180 398 226 432 300 432 C374 432 420 398 420 336 L420 100",
      "M388 96 C414 66 456 70 462 102 C468 134 440 164 404 156",
    ],
    strokeWidths: [16, 9],
    numberPositions: [
      { x: 156, y: 116 },
      { x: 390, y: 72 },
    ],
  },
  {
    key: "V",
    label: "V",
    speak: "chữ V",
    paths: [
      "M160 100 L300 420",
      "M300 420 L440 100",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 136, y: 116 },
      { x: 316, y: 420 },
    ],
  },
  {
    key: "X",
    label: "X",
    speak: "chữ X",
    paths: [
      "M160 100 L440 420",
      "M440 100 L160 420",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 136, y: 116 },
      { x: 450, y: 84 },
    ],
  },
  {
    key: "Y",
    label: "Y",
    speak: "chữ Y",
    paths: [
      "M160 100 L300 260",
      "M440 100 L300 260",
      "M300 260 L300 420",
    ],
    strokeWidths: [16, 16, 16],
    numberPositions: [
      { x: 136, y: 116 },
      { x: 450, y: 84 },
      { x: 276, y: 276 },
    ],
  },
  {
    key: "a",
    label: "a",
    speak: "chữ a",
    paths: [
      "M318 194 C248 154 168 196 158 278 C150 346 190 400 250 400 C292 400 326 374 340 334 C340 358 342 382 349 400",
      "M340 200 C330 260 330 342 350 400",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 142, y: 250 },
      { x: 365, y: 208 },
    ],
  },
  {
    key: "ă",
    label: "ă",
    speak: "chữ ă",
    paths: [
      "M318 194 C248 154 168 196 158 278 C150 346 190 400 250 400 C292 400 326 374 340 334 C340 358 342 382 349 400",
      "M340 200 C330 260 330 342 350 400",
      "M250 126 C270 150 330 150 350 126",
    ],
    strokeWidths: [16, 16, 9],
    numberPositions: [
      { x: 142, y: 250 },
      { x: 365, y: 208 },
      { x: 245, y: 92 },
    ],
  },
  {
    key: "â",
    label: "â",
    speak: "chữ â",
    paths: [
      "M318 194 C248 154 168 196 158 278 C150 346 190 400 250 400 C292 400 326 374 340 334 C340 358 342 382 349 400",
      "M340 200 C330 260 330 342 350 400",
      "M248 142 L302 106",
      "M302 106 L356 142",
    ],
    strokeWidths: [16, 16, 9, 9],
    numberPositions: [
      { x: 142, y: 250 },
      { x: 365, y: 208 },
      { x: 236, y: 116 },
      { x: 366, y: 116 },
    ],
  },
  {
    key: "b",
    label: "b",
    speak: "chữ b",
    paths: [
      "M208 104 C210 188 210 306 208 402",
      "M210 250 C252 198 346 202 374 264 C402 326 360 402 286 402 C244 402 216 374 208 336",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 184, y: 122 },
      { x: 235, y: 254 },
    ],
  },
  {
    key: "c",
    label: "c",
    speak: "chữ c",
    paths: [
      "M374 224 C332 180 242 184 192 242 C142 300 166 384 238 406 C292 422 344 402 376 362",
    ],
    strokeWidths: [16],
    numberPositions: [
      { x: 386, y: 220 },
    ],
  },
  {
    key: "d",
    label: "d",
    speak: "chữ d",
    paths: [
      "M332 250 C292 198 198 202 170 264 C142 326 184 402 258 402 C300 402 328 374 336 336",
      "M334 104 C336 188 336 306 334 402",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 160, y: 254 },
      { x: 360, y: 118 },
    ],
  },
  {
    key: "đ",
    label: "đ",
    speak: "chữ đ",
    paths: [
      "M332 250 C292 198 198 202 170 264 C142 326 184 402 258 402 C300 402 328 374 336 336",
      "M334 104 C336 188 336 306 334 402",
      "M206 178 L368 178",
    ],
    strokeWidths: [16, 16, 10],
    numberPositions: [
      { x: 160, y: 254 },
      { x: 360, y: 118 },
      { x: 190, y: 160 },
    ],
  },
  {
    key: "e",
    label: "e",
    speak: "chữ e",
    paths: [
      "M370 300 L172 300 C174 242 218 196 284 196 C344 196 390 232 390 282",
      "M172 300 C168 358 210 410 282 410 C340 410 378 382 392 340",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 380, y: 282 },
      { x: 150, y: 318 },
    ],
  },
  {
    key: "ê",
    label: "ê",
    speak: "chữ ê",
    paths: [
      "M370 300 L172 300 C174 242 218 196 284 196 C344 196 390 232 390 282",
      "M172 300 C168 358 210 410 282 410 C340 410 378 382 392 340",
      "M246 158 L300 122",
      "M300 122 L354 158",
    ],
    strokeWidths: [16, 16, 9, 9],
    numberPositions: [
      { x: 380, y: 282 },
      { x: 150, y: 318 },
      { x: 236, y: 134 },
      { x: 364, y: 134 },
    ],
  },
  {
    key: "g",
    label: "g",
    speak: "chữ g",
    paths: [
      "M338 246 C306 210 248 208 210 242 C170 278 176 346 222 380 C266 412 328 392 350 346 C370 304 366 266 338 246",
      "M350 250 C362 322 356 398 328 438 C294 486 218 478 172 426",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 345, y: 226 },
      { x: 370, y: 256 },
    ],
  },
  {
    key: "h",
    label: "h",
    speak: "chữ h",
    paths: [
      "M220 100 C222 200 222 300 220 410",
      "M220 280 C260 220 360 220 380 280 C385 310 382 360 380 410",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 196, y: 116 },
      { x: 236, y: 270 },
    ],
  },
  {
    key: "i",
    label: "i",
    speak: "chữ i",
    paths: [
      "M300 200 L300 410",
      "M300 132 C312 132 322 122 322 110 C322 98 312 88 300 88 C288 88 278 98 278 110 C278 122 288 132 300 132",
    ],
    strokeWidths: [16, 9],
    numberPositions: [
      { x: 276, y: 216 },
      { x: 276, y: 92 },
    ],
  },
  {
    key: "k",
    label: "k",
    speak: "chữ k",
    paths: [
      "M220 100 C222 200 222 300 220 410",
      "M380 220 L220 320",
      "M220 320 L380 410",
    ],
    strokeWidths: [16, 16, 16],
    numberPositions: [
      { x: 196, y: 116 },
      { x: 390, y: 200 },
      { x: 236, y: 338 },
    ],
  },
  {
    key: "l",
    label: "l",
    speak: "chữ l",
    paths: [
      "M300 100 C302 200 302 300 300 410",
    ],
    strokeWidths: [16],
    numberPositions: [
      { x: 276, y: 116 },
    ],
  },
  {
    key: "m",
    label: "m",
    speak: "chữ m",
    paths: [
      "M180 410 C178 330 180 260 180 200",
      "M180 270 C200 210 280 200 320 240 C330 250 332 290 330 410",
      "M330 270 C350 210 430 200 470 240 C480 250 482 290 480 410",
    ],
    strokeWidths: [16, 16, 16],
    numberPositions: [
      { x: 156, y: 392 },
      { x: 196, y: 260 },
      { x: 346, y: 260 },
    ],
  },
  {
    key: "n",
    label: "n",
    speak: "chữ n",
    paths: [
      "M180 410 C178 330 180 260 180 200",
      "M180 270 C200 210 300 200 340 240 C350 250 352 290 350 410",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 156, y: 392 },
      { x: 196, y: 260 },
    ],
  },
  {
    key: "o",
    label: "o",
    speak: "chữ o",
    paths: [
      "M280 198 C216 198 168 242 168 304 C168 366 216 412 280 412 C344 412 392 366 392 304 C392 242 344 198 280 198 Z",
    ],
    strokeWidths: [16],
    numberPositions: [
      { x: 270, y: 178 },
    ],
  },
  {
    key: "ô",
    label: "ô",
    speak: "chữ ô",
    paths: [
      "M280 198 C216 198 168 242 168 304 C168 366 216 412 280 412 C344 412 392 366 392 304 C392 242 344 198 280 198 Z",
      "M234 164 L280 132",
      "M280 132 L326 164",
    ],
    strokeWidths: [16, 9, 9],
    numberPositions: [
      { x: 270, y: 178 },
      { x: 224, y: 142 },
      { x: 336, y: 142 },
    ],
  },
  {
    key: "ơ",
    label: "ơ",
    speak: "chữ ơ",
    paths: [
      "M280 198 C216 198 168 242 168 304 C168 366 216 412 280 412 C344 412 392 366 392 304 C392 242 344 198 280 198 Z",
      "M364 178 C388 150 424 156 430 186 C436 216 408 246 370 236",
    ],
    strokeWidths: [16, 9],
    numberPositions: [
      { x: 270, y: 178 },
      { x: 368, y: 154 },
    ],
  },
  {
    key: "p",
    label: "p",
    speak: "chữ p",
    paths: [
      "M200 200 C202 260 202 330 200 450",
      "M200 280 C220 220 300 210 340 250 C370 280 370 340 340 370 C300 410 220 410 200 370",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 176, y: 216 },
      { x: 216, y: 270 },
    ],
  },
  {
    key: "q",
    label: "q",
    speak: "chữ q",
    paths: [
      "M400 200 C402 260 402 330 400 450",
      "M400 280 C380 220 300 210 260 250 C230 280 230 340 260 370 C300 410 380 410 400 370",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 424, y: 216 },
      { x: 376, y: 270 },
    ],
  },
  {
    key: "r",
    label: "r",
    speak: "chữ r",
    paths: [
      "M190 410 C188 330 190 260 190 210",
      "M190 270 C210 220 300 210 340 240",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 166, y: 392 },
      { x: 206, y: 260 },
    ],
  },
  {
    key: "s",
    label: "s",
    speak: "chữ s",
    paths: [
      "M380 220 C360 180 260 180 240 220 C230 240 240 260 280 280 C340 310 360 330 340 370 C320 400 240 420 200 400",
    ],
    strokeWidths: [16],
    numberPositions: [
      { x: 384, y: 202 },
    ],
  },
  {
    key: "t",
    label: "t",
    speak: "chữ t",
    paths: [
      "M250 160 C252 250 252 340 250 410",
      "M150 220 L350 220",
    ],
    strokeWidths: [16, 10],
    numberPositions: [
      { x: 226, y: 176 },
      { x: 138, y: 202 },
    ],
  },
  {
    key: "u",
    label: "u",
    speak: "chữ u",
    paths: [
      "M170 210 C172 270 172 330 170 400",
      "M170 330 C170 380 220 420 300 420 C380 420 430 380 430 330 L430 210",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 146, y: 226 },
      { x: 186, y: 342 },
    ],
  },
  {
    key: "ư",
    label: "ư",
    speak: "chữ ư",
    paths: [
      "M170 210 C172 270 172 330 170 400",
      "M170 330 C170 380 220 420 300 420 C380 420 430 380 430 330 L430 210",
      "M392 180 C416 152 452 158 458 188 C464 218 436 248 398 238",
    ],
    strokeWidths: [16, 16, 9],
    numberPositions: [
      { x: 146, y: 226 },
      { x: 186, y: 342 },
      { x: 394, y: 156 },
    ],
  },
  {
    key: "v",
    label: "v",
    speak: "chữ v",
    paths: [
      "M180 220 L300 410",
      "M300 410 L420 220",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 156, y: 236 },
      { x: 316, y: 410 },
    ],
  },
  {
    key: "x",
    label: "x",
    speak: "chữ x",
    paths: [
      "M180 220 L420 410",
      "M420 220 L180 410",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 156, y: 236 },
      { x: 430, y: 202 },
    ],
  },
  {
    key: "y",
    label: "y",
    speak: "chữ y",
    paths: [
      "M180 220 L300 320 L420 220",
      "M300 320 C300 360 280 400 240 420",
    ],
    strokeWidths: [16, 16],
    numberPositions: [
      { x: 156, y: 236 },
      { x: 316, y: 338 },
    ],
  },
];
