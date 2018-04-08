// -----------------------------------------------------
//                                         Patch Scripts
//                                               -------
export const patch = () => {
  console.log('patch');
  if (typeof global.self === "undefined") {
    console.log('[patch] global.self = global;');
    global.self = global;
  }
};
