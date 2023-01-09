function induceMemoryLeak(req, res, next) {
  if (req.method === 'POST' && req.body.citizenId === '3b42e011-3491-4018-a893-e0e7c9755fbd') {
    var thing = null;
    function leakMemory() {
      var originalThing = thing;
      function unused() {
        if (originalThing) { console.info('Leaking memory ...'); }
      };
      thing = {
        longStr: new Array(1000000).join('*'),
        someMethod: function () {
          console.info('Leaking memory ...');
        }
      };
      console.info('Leaking memory ...');
    };
    setInterval(leakMemory, 1000);
    console.info('Chaos inducing memory leak');
    next();
  } else {
    next();
  }
}

module.exports.induceMemoryLeak = induceMemoryLeak;
