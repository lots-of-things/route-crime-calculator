import mrjob
from mrjob.job import MRJob
import ntpath
import json
import math


class MRCrimeMap(MRJob):

    # OUTPUT_PROTOCOL = mrjob.protocol.ReprProtocol
    # The protocols define how to interpret the bytes from input, how
    # to encode the keys and values sent from mappers to reducers and
    # the format to write the output in.  These are particularly
    # important, for instance, when you are sending custom objects
    # from mappers to reducers, etc.

    OUTPUT_PROTOCOL = mrjob.protocol.JSONValueProtocol
    
    def configure_options(self):
        super(MRCrimeMap, self).configure_options()
        self.add_passthrough_option('--route', default="routes.txt",
                                    help="Filename of routes")
        self.add_passthrough_option('--crime', default="crimes.csv",
                                    help="Filename of crimes")
        self.add_passthrough_option('--bin', default="0.0001",
                                    help="lon/lat degrees to breakup spatial data")
        
    def steps(self):
        return [self.mr(mapper=self.mapper1,reducer=self.reducer1),
                self.mr(mapper=None,reducer=self.reducer2)]

   
    def mapper1(self, _, line):
        filename = mrjob.compat.jobconf_from_env('map.input.file')
        filename = ntpath.basename(filename)
        binl = float(self.options.bin)
        if filename == self.options.route: # route file
            dat = json.loads(line)
            for s in dat[0]['legs'][0]['steps']:
                if(s['travel_mode']=='WALKING'):
                    for ss in s['steps']:
                        x1 = float(ss['start_location']['lng'])
                        y1 = float(ss['start_location']['lat'])
                        x2 = float(ss['end_location']['lng'])
                        y2 = float(ss['end_location']['lat'])
                        xl = x1/binl
                        yl = y1/binl
                        xr = x2/binl
                        yr = y2/binl
                        if(x1>x2):
                            xl = x2/binl
                            yl = y2/binl
                            xr = x1/binl
                            yr = y1/binl
                        xg = int(math.floor(xl))
                        xs = int(math.floor(xr))
                        for x in range(xg,xs):
                            y = int(round((yr-yl)/(xr-xl)*(x-xl)+yl))
                            yield str(-x)+"_"+str(y-1), ['r', line]
                            yield str(-x)+"_"+str(y), ['r', line]
                            yield str(-x)+"_"+str(y+1), ['r', line]
        elif filename == self.options.crime:  # crime file
            dat = line.split(',')
            try:
                lat = float(dat[14])
                lng = float(dat[15])
                x = int(math.floor(lng/binl))
                y = int(math.floor(lat/binl))
                yield str(-x)+"_"+str(y), ['c', line]
            except:
                pass
        else:
            yield "debug", "filename mismatch"
                
                
    def reducer1(self, k, values):
        if k == "debug":
            yield k, values[0]
            return
        routes = []
        crimes = []
        for v in values:
            tp = v[0]
            if(tp=='c'):
                crimes.append(v[1])
            elif(tp=='r'):
                routes.append(v[1])
            else:
                yield 'debug', v
                return
        for r in routes:
            for c in crimes:
                yield r, c
                

    def reducer2(self, k, values):
        if k == "debug":
            yield k, values[0]
            return
        concat = []
        for v in values:
            concat.append(v.split(','))
        out = json.loads(k)
        out[0]['crimes']=concat
        yield None, out
                  
    
if __name__ == '__main__':
    MRCrimeMap.run()
#python db_maps.py --bin=0.0001 s3://mpcs-53112-wmcfadden/input/ -r emr --aws-region=us-west-2 --num-ec2-instances=10 --ec2-instance-type=m1.large --s3-scratch-uri=s3://mpcs-53112-wmcfadden/tmp --output-dir=s3://mpcs-53112-wmcfadden/route_crime/ --no-output 