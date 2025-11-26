// Matrix functions
// Perspective matrix
function perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
}

// Orthographic matrix
function ortho(left, right, bottom, top, near, far) {
    const lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
    return [-2*lr,0,0,0, 0,-2*bt,0,0, 0,0,2*nf,0, (left+right)*lr,(top+bottom)*bt,(far+near)*nf,1];
}

// Identity matrix
function mat4Identity() {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

// Matrix translation
function mat4Translate(matrix, translation) {
    const result = new Float32Array(matrix);
    result[12] = matrix[0] * translation[0] + matrix[4] * translation[1] + matrix[8] * translation[2] + matrix[12];
    result[13] = matrix[1] * translation[0] + matrix[5] * translation[1] + matrix[9] * translation[2] + matrix[13];
    result[14] = matrix[2] * translation[0] + matrix[6] * translation[1] + matrix[10] * translation[2] + matrix[14];
    result[15] = matrix[3] * translation[0] + matrix[7] * translation[1] + matrix[11] * translation[2] + matrix[15];
    return result;
}

// Matrix rotation around X axis
function mat4RotateX(matrix, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const result = new Float32Array(matrix);

    const mv1 = matrix[4], mv5 = matrix[5], mv9 = matrix[6], mv13 = matrix[7];
    const mv2 = matrix[8], mv6 = matrix[9], mv10 = matrix[10], mv14 = matrix[11];

    result[4] = mv1 * c + mv2 * s;
    result[5] = mv5 * c + mv6 * s;
    result[6] = mv9 * c + mv10 * s;
    result[7] = mv13 * c + mv14 * s;
    result[8] = mv2 * c - mv1 * s;
    result[9] = mv6 * c - mv5 * s;
    result[10] = mv10 * c - mv9 * s;
    result[11] = mv14 * c - mv13 * s;

    return result;
}

// Matrix rotation around Y axis
function mat4RotateY(matrix, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const result = new Float32Array(matrix);

    const mv0 = matrix[0], mv4 = matrix[1], mv8 = matrix[2], mv12 = matrix[3];
    const mv2 = matrix[8], mv6 = matrix[9], mv10 = matrix[10], mv14 = matrix[11];

    result[0] = mv0 * c - mv2 * s;
    result[1] = mv4 * c - mv6 * s;
    result[2] = mv8 * c - mv10 * s;
    result[3] = mv12 * c - mv14 * s;
    result[8] = mv0 * s + mv2 * c;
    result[9] = mv4 * s + mv6 * c;
    result[10] = mv8 * s + mv10 * c;
    result[11] = mv12 * s + mv14 * c;

    return result;
}

// Matrix multiplication
function multiplyMat4(a, b) {
    let r = new Float32Array(16);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
            sum += a[k * 4 + i] * b[j * 4 + k]; 
        }
        r[j * 4 + i] = sum;
    }
    return r;
}

function multiplyMat4Vec3(M, v){ // v as w=1
    const x=v[0], y=v[1], z=v[2];
    return [
        M[0]*x + M[4]*y + M[8]*z + M[12],
        M[1]*x + M[5]*y + M[9]*z + M[13],
        M[2]*x + M[6]*y + M[10]*z + M[14],
    ];
}
function mat3FromMat4(M){
    return new Float32Array([
        M[0], M[1], M[2],
        M[4], M[5], M[6],
        M[8], M[9], M[10],
    ]);
}
function mat3InverseTranspose(m){
    const a=m[0], b=m[1], c=m[2],
            d=m[3], e=m[4], f=m[5],
            g=m[6], h=m[7], i=m[8];
    const A =   e*i - f*h;
    const B = -(d*i - f*g);
    const C =   d*h - e*g;
    const D = -(b*i - c*h);
    const E =   a*i - c*g;
    const F = -(a*h - b*g);
    const G =   b*f - c*e;
    const H = -(a*f - c*d);
    const I =   a*e - b*d;
    let det = a*A + b*B + c*C;
    if(Math.abs(det) < 1e-8) det = 1e-8;
    const invT = new Float32Array([A, D, G, B, E, H, C, F, I]);
    for(let k=0;k<9;k++) invT[k] /= det;
    return invT;
}
