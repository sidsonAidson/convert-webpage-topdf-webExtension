/**
 * Created by sidson_aidson on 07/06/2017.
 * https://github.com/sidsonAidson/async-await-es7
 */

;(() => {
    function async(generator) {
        return  function ()   {
            return new Promise((resolve, reject) => {

                let iterator = generator.apply(undefined, Array.from(arguments));

                let  iterate = iteration =>  {
                    if (iteration.done) {
                        resolve(iteration.value);
                        return;
                    }


                    const promise = iteration.value;

                    return promise
                        .then(p =>  {
                            iterate(iterator.next(p))
                        })
                        .catch(e => {
                            try {
                                iterator.throw(e);
                            } catch (e) {
                                reject(e)
                            }
                        })

                };

                return iterate(iterator.next());
            })
        };
    }


    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    {
        module.exports = async;
    }
    else
    {
        window.async = async;
    }
})();
