
function testData0() {
    return  {
        attributes : {
            aVertColor : {
                attr : [    
                    -100, -100,  0, 1, 0, 0, 1,
                    0,    100,  0, 0, 1, 0, 1,
                    500,  500,  0, 1, 1, 0, 1
                ],
                stride : 7
            }
        },
        vertStride : 7,
        indeices : [0, 1, 2]
    }
}

function testTextureData() {
    return  {
        attributes : {
            aPos : {
                attr : [    
                        0,    0,    0, 
                        100,  0,    0, 
                        100,  100,  0, 
                        0,  100,    0
                ],
                stride : 3
            },
            aCoord : {
                attr : [    
                        0, 0,
                        1, 0,
                        1, 1,
                        0, 1
                ],
                stride : 2
            }
        },
        indeices : [0, 1, 2, 0, 2, 3]
    }
}

function testData_zbuffer() {
    return  {
        vertStride : 7,
        attributes : {
            aVertColor : {
                attr : [    
                    -100, -100,  30, 1, 0, 0, 1,
                    0,    100,  30, 0, 1, 0, 1,
                    100,  0,    30, 1, 1, 0, 1,
                    0,    0,    2, 0, 0, 1, 1,
                    100,  100,  2, 0, 0, 1, 1,
                    200,  0,    2, 0, 0, 1, 1,
                ],
                stride : 7
            }
        },
        indeices : [0, 1, 2, 3, 4, 5]
    }
}



function testData_alix() {
    return  {
        attributes : {
            aVertColor : {
                attr : [    
                    -1000,  1,      0, 0, 0, 0, 1,
                    -1000, -1,      0, 0, 0, 0, 1,
                    1000,  1,      0, 0, 0, 0, 1,
                    1000, -1,      0, 0, 0, 0, 1,
        
                    -1,    1000,    0, 0, 0, 0, 1,
                    1,    1000,    0, 0, 0, 0, 1,
                    -1,   -1000,    0, 0, 0, 0, 1,
                    1,   -1000,    0, 0, 0, 0, 1,
                ],
                stride : 7
            }
        },
        indeices : [0, 1, 2, 1, 2, 3,
                    4, 6, 5, 5, 6, 7]
    }
}